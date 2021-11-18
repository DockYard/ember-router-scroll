import Service, { inject as service } from '@ember/service';
import { set, get, action } from '@ember/object';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import { scheduleOnce } from '@ember/runloop';
import { addListener, removeListener, sendEvent } from '@ember/object/events';
import { setupRouter, whenRouteIdle } from 'ember-app-scheduler';

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
 * @param {string?} url
 * @void
 */
function tryScrollRecursively(fn, scrollHash, element, url) {
  let documentHeight;
  // read DOM outside of rAF
  if (element) {
    documentHeight = Math.max(
      element.scrollHeight,
      element.offsetHeight,
      element.clientHeight
    );
  } else {
    const { body, documentElement: html } = document;
    documentHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  }

  callbackRequestId = window.requestAnimationFrame(() => {
    if (url && url.indexOf('#') > -1) {
      const hashElement = document.getElementById(url.split('#').pop());
      if (hashElement) {
        scrollHash = { x: hashElement.offsetLeft, y: hashElement.offsetTop };
      }
    }
    // write DOM (scrollTo causes reflow)
    if (documentHeight >= scrollHash.y || ATTEMPTS >= MAX_ATTEMPTS) {
      ATTEMPTS = 0;
      fn.call(null, scrollHash.x, scrollHash.y);
    } else {
      ATTEMPTS++;
      tryScrollRecursively(fn, scrollHash, element, url);
    }
  });
}

// to prevent scheduleOnce calling multiple times, give it the same ref to this function
const CALLBACK = function (transition) {
  this.updateScrollPosition(transition);
};

class RouterScroll extends Service {
  @service router;

  get isFastBoot() {
    const fastboot = getOwner(this).lookup('service:fastboot');
    return fastboot ? fastboot.get('isFastBoot') : false;
  }

  key;
  targetElement;
  scrollElement = 'window';
  isFirstLoad = true;
  preserveScrollPosition = false;
  // ember-app-scheduler properties
  scrollWhenIdle = false;
  scrollWhenAfterRender = false;

  constructor() {
    super(...arguments);

    // https://github.com/ember-app-scheduler/ember-app-scheduler/pull/773
    setupRouter(this.router);
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init(...args) {
    super.init(...args);

    this._loadConfig();
    set(this, 'scrollMap', {
      default: {
        x: 0,
        y: 0,
      },
    });

    addListener(this.router, 'routeWillChange', this._routeWillChange);
    addListener(this.router, 'routeDidChange', this._routeDidChange);
  }

  willDestroy() {
    removeListener(this.router, 'routeWillChange', this._routeWillChange);
    removeListener(this.router, 'routeDidChange', this._routeDidChange);

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
    if (this.isFirstLoad) {
      this.unsetFirstLoad();
    }

    let scrollPosition = this.position;

    // If `preserveScrollPosition` was not set on the controller, attempt fallback to `preserveScrollPosition` which was set on the router service.
    let preserveScrollPosition =
      (transition.router.currentRouteInfos || []).some(
        (routeInfo) => routeInfo.route.controller.preserveScrollPosition
      ) || this.preserveScrollPosition;

    if (!preserveScrollPosition) {
      const { scrollElement, targetElement, currentURL } = this;

      if (targetElement || 'window' === scrollElement) {
        tryScrollRecursively(window.scrollTo, scrollPosition, null, currentURL);
      } else if ('#' === scrollElement.charAt(0)) {
        const element = document.getElementById(scrollElement.substring(1));

        if (element) {
          let fn = (x, y) => {
            element.scrollLeft = x;
            element.scrollTop = y;
          };
          tryScrollRecursively(fn, scrollPosition, element, currentURL);
        }
      }
    }

    sendEvent(this, 'didScroll', transition);
  }

  @action
  _routeWillChange() {
    if (this.isFastBoot) {
      return;
    }

    this.update();
  }

  @action
  _routeDidChange(transition) {
    if (this.isFastBoot) {
      return;
    }

    const scrollWhenIdle = this.scrollWhenIdle;
    const scrollWhenAfterRender = this.scrollWhenAfterRender;

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

  unsetFirstLoad() {
    set(this, 'isFirstLoad', false);
  }

  update() {
    if (this.isFastBoot || this.isFirstLoad) {
      return;
    }

    const scrollElement = this.scrollElement;
    const targetElement = this.targetElement;
    const scrollMap = this.scrollMap;
    const key = this.key;
    let x;
    let y;

    if (targetElement) {
      let element = document.querySelector(targetElement);
      if (element) {
        x = element.offsetLeft;
        y = element.offsetTop;

        // if we are looking to where to transition to next, we need to set the default to the position
        // of the targetElement on screen
        set(scrollMap, 'default', {
          x,
          y,
        });
      }
    } else if ('window' === scrollElement) {
      x = window.scrollX;
      y = window.scrollY;
    } else if ('#' === scrollElement.charAt(0)) {
      let element = document.getElementById(scrollElement.substring(1));

      if (element) {
        x = element.scrollLeft;
        y = element.scrollTop;
      }
    }

    // only a `key` present after first load
    if (key && 'number' === typeOf(x) && 'number' === typeOf(y)) {
      set(scrollMap, key, {
        x,
        y,
      });
    }
  }

  _loadConfig() {
    const config = getOwner(this).resolveRegistration('config:environment');

    if (config && config.routerScroll) {
      const scrollElement = config.routerScroll.scrollElement;
      const targetElement = config.routerScroll.targetElement;

      assert(
        'You defined both scrollElement and targetElement in your config. We currently only support definining one of them',
        !(scrollElement && targetElement)
      );

      if ('string' === typeOf(scrollElement)) {
        set(this, 'scrollElement', scrollElement);
      }

      if ('string' === typeOf(targetElement)) {
        set(this, 'targetElement', targetElement);
      }

      const { scrollWhenIdle = false, scrollWhenAfterRender = false } =
        config.routerScroll;
      set(this, 'scrollWhenIdle', scrollWhenIdle);
      set(this, 'scrollWhenAfterRender', scrollWhenAfterRender);
    }
  }
}

Object.defineProperty(RouterScroll.prototype, 'position', {
  configurable: true,
  get() {
    const scrollMap = this.scrollMap;
    const stateUuid = window.history.state?.uuid;

    set(this, 'key', stateUuid);
    const key = this.key || '-1';

    return get(scrollMap, key) || scrollMap.default;
  },
});

export default RouterScroll;
