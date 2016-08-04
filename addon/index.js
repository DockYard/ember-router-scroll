import Ember from 'ember';

const {
  get,
  inject,
  run: { next },
} = Ember;

export default Ember.Mixin.create({
  service: inject.service('router-scroll'),

  willTransition(...args) {
    this._super(...args);
    get(this, 'service').update();
  },

  didTransition(transitions, ...args) {
    this._super(transitions, ...args);
    next(() => {
      let scrollPosition = get(this, 'service.position');

      let preserveScrollPosition = transitions[transitions.length - 1]
        .handler.controller.get('preserveScrollPosition');

      if (!preserveScrollPosition) {
        window.scrollTo(scrollPosition.x, scrollPosition.y);
      }
    });
  }
});
