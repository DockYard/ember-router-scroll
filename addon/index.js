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
    const scrollElement = get(this, 'service.scrollElement');
    let scrollPosition = get(this, 'service.position');

    let preserveScrollPosition = transitions[transitions.length - 1]
      .handler.controller.get('preserveScrollPosition');

    if (!preserveScrollPosition) {
      if ('window' === scrollElement) {
        window.scrollTo(scrollPosition.x, scrollPosition.y);

      } else if ('#' === scrollElement.charAt(0)) {
        let element = document.getElementById(scrollElement.substring(1));

        if (element) {
          element.scrollLeft = scrollPosition.x;
          element.scrollTop = scrollPosition.y;
        }
      }
    }
  }
});
