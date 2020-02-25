import EmberRouter from '@ember/routing/router';
import { get, computed } from '@ember/object';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import { scheduleOnce } from '@ember/runloop';
import { setupRouter, reset, whenRouteIdle } from 'ember-app-scheduler';

let requestId;
let IDLE_REQUESTED_CALLBACK = false;

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

    const scrollWhenIdle = get(this, 'service.scrollWhenIdle');
    const scrollWhenAfterRender = get(this, 'service.scrollWhenAfterRender');

    if (!scrollWhenIdle && !scrollWhenAfterRender) {
      // out of the option, this happens on the tightest schedule
      scheduleOnce('render', this, CALLBACK, transition);
    } else if (scrollWhenAfterRender && !scrollWhenIdle) {
      // out of the option, this happens on the tightest schedule
      scheduleOnce('afterRender', this, CALLBACK, transition);
    } else {
      if (IDLE_REQUESTED_CALLBACK) {
        return;
      }

      IDLE_REQUESTED_CALLBACK = true;

      // as described in ember-app-scheduler, this addon can be used to delay rendering until after the route is idle
      whenRouteIdle().then(() => {
        IDLE_REQUESTED_CALLBACK = false;
        this.updateScrollPosition(transition);
      });
    }
  }
}

export default EmberRouterScroll;
