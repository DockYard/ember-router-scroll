import EmberRouter from '@ember/routing/router';
import { get, computed } from '@ember/object';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import { scheduleOnce } from '@ember/runloop';
import { setupRouter, reset, whenRouteIdle, whenRoutePainted } from 'ember-app-scheduler';
import { getScrollBarWidth } from './utils/scrollbar-width';

let ATTEMPTS = 0;
const MAX_ATTEMPTS = 100; // rAF runs every 16ms ideally, so 60x a second
let requestId;
let scrollBarWidth = 0;

class EmberRouterScroll extends EmberRouter {
  @inject('router-scroll') service;

  @computed
  get isFastBoot() {
    const fastboot = getOwner(this).lookup('service:fastboot');
    return fastboot ? fastboot.get('isFastBoot') : false;
  }

  init() {
    super.init(...arguments);

    setupRouter(this);

    this.on('routeWillChange', () => {
      this._routeWillChange();
    });

    this.on('routeDidChange', (transition) => {
      this._routeDidChange(transition);
    });

    if (!get(this, 'isFastBoot')) {
      scrollBarWidth = getScrollBarWidth();
    }
  }

  destroy() {
    reset();

    if (requestId) {
      window.cancelAnimationFrame(requestId);
    }

    super.destroy(...arguments);
  }

  /**
   * Updates the scroll position
   * it will be a single transition
   * @method updateScrollPosition
   * @param {transition|transition[]} transition If before Ember 3.6, this will be an array of transitions, otherwise
   */
  updateScrollPosition(transition) {
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

    let preserveScrollPosition = (get(transition, 'router.currentRouteInfos') || []).some((routeInfo) => get(routeInfo, 'route.controller.preserveScrollPosition'));

    // If `preserveScrollPosition` was not set on the controller, attempt fallback to `preserveScrollPosition` which was set on the router service.
    if(!preserveScrollPosition) {
      preserveScrollPosition = get(this, 'service.preserveScrollPosition')
    }

    if (!preserveScrollPosition) {
      const scrollElement = get(this, 'service.scrollElement');
      const targetElement = get(this, 'service.targetElement');

      if (targetElement || 'window' === scrollElement) {
        window.scrollTo(scrollPosition.x, scrollPosition.y);
      } else if ('#' === scrollElement.charAt(0)) {
        const element = document.getElementById(scrollElement.substring(1));

        if (element) {
          element.scrollLeft = scrollPosition.x;
          element.scrollTop = scrollPosition.y;
        }
      }
    }
  }

  _routeWillChange() {
    if (get(this, 'isFastBoot')) {
      return;
    }

    get(this, 'service').update();
  }

  _routeDidChange(transition) {
    if (get(this, 'isFastBoot')) {
      return;
    }

    const delayScrollTop = get(this, 'service.delayScrollTop');
    const scrollWhenPainted = get(this, 'service.scrollWhenPainted');
    const scrollWhenIdle = get(this, 'service.scrollWhenIdle');

    if (!delayScrollTop && !scrollWhenPainted && !scrollWhenIdle) {
      // out of the 3 options, this happens on the tightest schedule
      const callback = function() {
        this.updateScrollPosition(transition);
      }
      scheduleOnce('render', this, callback);
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
}

export default EmberRouterScroll;
