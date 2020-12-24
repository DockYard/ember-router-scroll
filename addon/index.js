import EmberRouter from '@ember/routing/router';
import { get, computed } from '@ember/object';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import { scheduleOnce } from '@ember/runloop';
import { setupRouter, reset, whenRouteIdle } from 'ember-app-scheduler';

let ATTEMPTS = 0;
const MAX_ATTEMPTS = 100; // rAF runs every 16ms ideally, so 60x a second

let requestId;
let callbackRequestId;

/**
 * By default, we start checking to see if the document height is >= the last known `y` position
 * we want to scroll to.  This is important for content heavy pages that might try to scrollTo
 * before the content has painted
 *
 * @method tryScrollRecursively
 * @param {Function} fn
 * @param {Object} scrollHash
 * @param {Element} [element]
 * @void
 */
function tryScrollRecursively(fn, scrollHash, element) {
  let documentHeight;
  // read DOM outside of rAF
  if (element) {
    documentHeight = Math.max(element.scrollHeight, element.offsetHeight, element.clientHeight);
  } else {
    const body = document.body;
    const html = document.documentElement;
    documentHeight = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);
  }

  callbackRequestId = window.requestAnimationFrame(() => {
    // write DOM (scrollTo causes reflow)
    if (documentHeight >= scrollHash.y || ATTEMPTS >= MAX_ATTEMPTS) {
      ATTEMPTS = 0;
      fn.call(null, scrollHash.x, scrollHash.y);
    } else {
      ATTEMPTS++;
      tryScrollRecursively(fn, scrollHash)
    }
  })
}

// to prevent scheduleOnce calling multiple times, give it the same ref to this function
const CALLBACK = function(transition) {
  this.updateScrollPosition(transition);
}

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
  }

  willDestroy() {
    reset();

    if (requestId) {
      window.cancelAnimationFrame(requestId);
    }

    if (callbackRequestId) {
      window.cancelAnimationFrame(callbackRequestId);
    }

    super.willDestroy(...arguments);
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
        tryScrollRecursively(window.scrollTo, scrollPosition);
      } else if ('#' === scrollElement.charAt(0)) {
        const element = document.getElementById(scrollElement.substring(1));

        if (element) {
          let fn = (x, y) => {
            element.scrollLeft = x;
            element.scrollTop = y;
          }
          tryScrollRecursively(fn, scrollPosition, element);
        }
      }
    }

    this.trigger('didScroll', transition);
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

    const scrollWhenIdle = get(this, 'service.scrollWhenIdle');
    const scrollWhenAfterRender = get(this, 'service.scrollWhenAfterRender');

    if (!scrollWhenIdle && !scrollWhenAfterRender) {
      // out of the option, this happens on the tightest schedule
      scheduleOnce('render', this, CALLBACK, transition);
    } else if (scrollWhenAfterRender && !scrollWhenIdle) {
      // out of the option, this happens on the second tightest schedule
      scheduleOnce('afterRender', this, CALLBACK, transition);
    } else {
      whenRouteIdle().then(() => {
        this.updateScrollPosition(transition);
      });
    }
  }
}

export default EmberRouterScroll;
