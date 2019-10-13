import Mixin from '@ember/object/mixin';
import { get, getWithDefault, computed } from '@ember/object';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import { scheduleOnce } from '@ember/runloop';
import { setupRouter, reset, whenRouteIdle, whenRoutePainted } from 'ember-app-scheduler';
import { gte } from 'ember-compatibility-helpers';
import { getScrollBarWidth } from './utils/scrollbar-width';

let ATTEMPTS = 0;
const MAX_ATTEMPTS = 100; // rAF runs every 16ms ideally, so 60x a second
let requestId;
let scrollBarWidth = 0;

/**
 * By default, we start checking to see if the document height is >= the last known `y` position
 * we want to scroll to.  This is important for content heavy pages that might try to scrollTo
 * before the content has painted
 *
 * @method tryScrollRecursively
 * @param {Function} fn
 * @param {Object} scrollHash
 * @void
 */
function tryScrollRecursively(fn, scrollHash) {
  const body = document.body;
  const html = document.documentElement;
  // read DOM outside of rAF
  const documentWidth = Math.max(body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth);
  const documentHeight = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
  const { innerHeight, innerWidth } = window;

  requestId = window.requestAnimationFrame(() => {
    // write DOM (scrollTo causes reflow)
    if (documentWidth + scrollBarWidth - innerWidth >= scrollHash.x
        && documentHeight + scrollBarWidth - innerHeight >= scrollHash.y
        || ATTEMPTS >= MAX_ATTEMPTS) {
      ATTEMPTS = 0;
      fn.call(null, scrollHash.x, scrollHash.y);
    } else {
        ATTEMPTS++;
        tryScrollRecursively(fn, scrollHash)
    }
  })
}

let RouterScrollMixin = Mixin.create({
  service: inject('router-scroll'),

  isFastBoot: computed(function() {
    const fastboot = getOwner(this).lookup('service:fastboot');
    return fastboot ? fastboot.get('isFastBoot') : false;
  }),

  init() {
    this._super(...arguments);

    setupRouter(this);

    if (gte('3.6.0-beta.1')) {
      this.on('routeWillChange', () => {
        this._routeWillChange();
      });

      this.on('routeDidChange', (transition) => {
        this._routeDidChange(transition);
      });
    }
    if (!get(this, 'isFastBoot')) {
      scrollBarWidth = getScrollBarWidth();
    }
  },

  destroy() {
    reset();

    if (requestId) {
      window.cancelAnimationFrame(requestId);
    }

    this._super(...arguments);
  },

  /**
   * Updates the scroll position
   * it will be a single transition
   * @method updateScrollPosition
   * @param {transition|transition[]} transition If before Ember 3.6, this will be an array of transitions, otherwise
   * @param {Boolean} recursiveCheck -  if "true", check until document height is >= y. `y` is the last coordinate the target page was on
   */
  updateScrollPosition(transition, recursiveCheck) {
    const url = get(this, 'currentURL');
    const hashElement = url ? document.getElementById(url.split('#').pop()) : null;

    if (get(this, 'service.isFirstLoad')) {
      get(this, 'service').unsetFirstLoad();
    }

    let scrollPosition;

    if (url && url.indexOf('#') > -1 && hashElement) {
      scrollPosition = { x: hashElement.offsetLeft, y: hashElement.offsetTop };
    } else {
      scrollPosition = get(this, 'service.position');
    }

    let preserveScrollPosition;
    if (gte('3.6.0-beta.1')) {
      preserveScrollPosition = getWithDefault(transition, 'router.currentRouteInfos', []).some((routeInfo) => get(routeInfo, 'route.controller.preserveScrollPosition'));
    } else {
      preserveScrollPosition = transition.some((t) => get(t, 'handler.controller.preserveScrollPosition'));
    }

    // If `preserveScrollPosition` was not set on the controller, attempt fallback to `preserveScrollPosition` which was set on the router service.
    if(!preserveScrollPosition) {
      preserveScrollPosition = get(this, 'service.preserveScrollPosition')
    }

    if (!preserveScrollPosition) {
      const scrollElement = get(this, 'service.scrollElement');
      const targetElement = get(this, 'service.targetElement');

      if (targetElement || 'window' === scrollElement) {
        if (recursiveCheck) {
          // our own implementation
          tryScrollRecursively(window.scrollTo, scrollPosition);
        } else {
          // using ember-app-scheduler
          window.scrollTo(scrollPosition.x, scrollPosition.y);
        }
      } else if ('#' === scrollElement.charAt(0)) {
        const element = document.getElementById(scrollElement.substring(1));

        if (element) {
          element.scrollLeft = scrollPosition.x;
          element.scrollTop = scrollPosition.y;
        }
      }
    }
  },

  _routeWillChange() {
    if (get(this, 'isFastBoot')) {
      return;
    }

    get(this, 'service').update();
  },

  _routeDidChange(transition) {
    if (get(this, 'isFastBoot')) {
      return;
    }

    const delayScrollTop = get(this, 'service.delayScrollTop');
    const scrollWhenPainted = get(this, 'service.scrollWhenPainted');
    const scrollWhenIdle = get(this, 'service.scrollWhenIdle');

    if (!delayScrollTop && !scrollWhenPainted && !scrollWhenIdle) {
      // out of the 3 options, this happens on the tightest schedule
      scheduleOnce('render', this, () => this.updateScrollPosition(transition, true));
    } else if (scrollWhenPainted) {
      // as described in ember-app-scheduler, this addon can be used to delay rendering until after First Meaningful Paint.
      // If you loading your routes progressively, this may be a good option to delay scrollTop until the remaining DOM elements are painted.
      whenRoutePainted().then(() => {
        this.updateScrollPosition(transition);
      });
    } else {
      // as described in ember-app-scheduler, this addon can be used to delay rendering until after the route is idle
      whenRouteIdle().then(() => {
        this.updateScrollPosition(transition);
      });
    }
  }
});

if (!gte('3.6.0-beta.1')) {
  RouterScrollMixin = Mixin.create(RouterScrollMixin, {
    willTransition(...args) {
      this._super(...args);

      this._routeWillChange();
    },

    didTransition(transitions, ...args) {
      this._super(transitions, ...args);

      this._routeDidChange(transitions);
    }
  });
}

export default RouterScrollMixin;
