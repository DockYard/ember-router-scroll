import Mixin from '@ember/object/mixin'
import { get, computed } from '@ember/object'
import { inject } from '@ember/service'
import { getOwner } from '@ember/application'
import { scheduleOnce } from '@ember/runloop'

export default Mixin.create({
  scheduler: inject('scheduler'),
  service: inject('router-scroll'),

  isFastBoot: computed(function() {
    const fastboot = getOwner(this).lookup('service:fastboot');
    return fastboot ? fastboot.get('isFastBoot') : false;
  }),

  willTransition(...args) {
    this._super(...args);

		if (get(this, 'isFastBoot')) { return; }

    get(this, 'service').update();
  },

  didTransition(transitions, ...args) {
    this._super(transitions, ...args);

		if (get(this, 'isFastBoot')) { return; }

    const delayScrollTop = get(this, 'service.delayScrollTop')

    if (!delayScrollTop) {
      scheduleOnce('render', this, () => this.updateScrollPosition(transitions))
    } else {
      // as described in ember-app-scheduler, this addon can be used to delay rendering until after First Meaningful Paint.
      // If you loading your routes progressively, this may be a good option to delay scrollTop until the remaining DOM elements are painted.
      this.get('scheduler').scheduleWork('afterContentPaint', () => {
        this.updateScrollPosition(transitions)
      })
    }
  },

  updateScrollPosition (transitions) {
    const lastTransition = transitions[transitions.length - 1]

    let routerPath
    if (typeof get(lastTransition, 'handler._router') !== 'undefined') {
      routerPath = 'handler._router'
    } else {
      routerPath = 'handler.router'
    }
    const url = get(lastTransition, `${routerPath}.currentURL`)
    const hashElement = url ? document.getElementById(url.split('#').pop()) : null

    let scrollPosition;

    if(url && url.indexOf('#') > -1 && hashElement) {
      scrollPosition = { x: hashElement.offsetLeft, y: hashElement.offsetTop };
    } else {
      scrollPosition = get(this, 'service.position');
    }
    const scrollElement = get(this, 'service.scrollElement');

    const preserveScrollPosition = get(lastTransition, 'handler.controller.preserveScrollPosition');

    if (!preserveScrollPosition) {
      if ('window' === scrollElement) {
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
