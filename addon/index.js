import Mixin from '@ember/object/mixin';
import { get, computed } from '@ember/object';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import { scheduleOnce } from '@ember/runloop';
import { setupRouter, reset, whenRouteIdle } from 'ember-app-scheduler';

export default Mixin.create({
  service: inject('router-scroll'),

  isFastBoot: computed(function() {
    const fastboot = getOwner(this).lookup('service:fastboot');
    return fastboot ? fastboot.get('isFastBoot') : false;
  }),

  init() {
    this._super(...arguments);

    setupRouter(this);

    this.on('routeWillChange', () => {
      if (get(this, 'isFastBoot')) {
        return;
      }

      get(this, 'service').update();
    });

    this.on('routeDidChange', transition => {
      if (get(this, 'isFastBoot')) {
        return;
      }

      const delayScrollTop = get(this, 'service.delayScrollTop');

      if (!delayScrollTop) {
        scheduleOnce('render', this, () => this.updateScrollPosition(transition));
      } else {
        // as described in ember-app-scheduler, this addon can be used to delay rendering until after First Meaningful Paint.
        // If you loading your routes progressively, this may be a good option to delay scrollTop until the remaining DOM elements are painted.
        whenRouteIdle().then(() => {
          this.updateScrollPosition(transition);
        });
      }
    });
  },

  destroy() {
    reset();

    this._super(...arguments);
  },

  updateScrollPosition(transition) {
    const url = get(this, 'currentURL');
    const hashElement = url ? document.getElementById(url.split('#').pop()) : null;

    if (get(this, 'service.isFirstLoad')) {
      get(this, 'service').unsetFirstLoad();
      return;
    }

    let scrollPosition;

    if (url && url.indexOf('#') > -1 && hashElement) {
      scrollPosition = { x: hashElement.offsetLeft, y: hashElement.offsetTop };
    } else {
      scrollPosition = get(this, 'service.position');
    }

    const preserveScrollPosition = get(transition, 'handler.controller.preserveScrollPosition');

    if (!preserveScrollPosition) {
      const scrollElement = get(this, 'service.scrollElement');
      const targetElement = get(this, 'service.targetElement');

      if (targetElement) {
        window.scrollTo(scrollPosition.x, scrollPosition.y);
      } else if ('window' === scrollElement) {
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
});
