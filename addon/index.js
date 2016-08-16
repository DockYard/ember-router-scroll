import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

const {
  computed,
  get,
  inject,
  run: { next },
} = Ember;

export default Ember.Mixin.create({
  service: inject.service('router-scroll'),

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

    next(() => this.updateScrollPosition(transitions));
  },

  updateScrollPosition(transitions) {
    let scrollPosition = get(this, 'service.position');

    let preserveScrollPosition = transitions[transitions.length - 1]
      .handler.controller.get('preserveScrollPosition');

    if (!preserveScrollPosition) {
      window.scrollTo(scrollPosition.x, scrollPosition.y);
    }
  }
});
