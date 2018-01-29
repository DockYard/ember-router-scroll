import Mixin from '@ember/object/mixin';
import { get, computed } from '@ember/object';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';

export default Mixin.create({
  scheduler: inject('scheduler'),
  service: inject('router-scroll'),

  isFastBoot: computed(function() {
    const fastboot = getOwner(this).lookup('service:fastboot');
    return fastboot ? fastboot.get('isFastBoot') : false;
  }),

  willTransition(...args) {
    this._super(...args);
    get(this, 'service').update();
  },

  didTransition(transitions, ...args) {
    this._super(transitions, ...args);

		if (get(this, 'isFastBoot')) { return; }

    this.get('scheduler').scheduleWork('afterContentPaint', () => {
      this.updateScrollPosition(transitions);
    });
  },

  updateScrollPosition(transitions) {
    const lastTransition = transitions[transitions.length - 1];

    const url =  get(lastTransition, 'handler.router.currentURL');
    
    let scrollPosition;
    if(url.indexOf('#') > -1) {
      const hashElement = document.getElementById(url.split('#').pop());
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
