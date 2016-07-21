import Ember from 'ember';

// ember-router-scroll variables
let popStateEvent = false;
const scrollMap = {};
let windowLocation = '';

// ember-router-scroll event handler
window.addEventListener('popstate', () => {
  popStateEvent = true;
});

export default Ember.Mixin.create({

  willTransition(...args) {
    this._super(...args);
    scrollMap[windowLocation] = Ember.$(window).scrollTop();
  },

  didTransition(transitions, ...args) {
    this._super(transitions, ...args);

    Ember.run.next(() => {
      windowLocation = window.location.pathname;
      const scrollPosition = scrollMap[windowLocation] ? scrollMap[windowLocation] : 0;
      const preserveScrollPosition = transitions[transitions.length - 1]
        .handler.controller.get('preserveScrollPosition');
      if (popStateEvent) {
        // If the back or forward browser button is pressed, set scroll top to
        // the position it had when the page was last seen.
        Ember.$(window).scrollTop(scrollPosition);
      } else {
        // This is an initial or direct page visit, so begin at page top.
        if (preserveScrollPosition) {return;}
        Ember.$(window).scrollTop(0);
      }

      // Reset popstate event status.
      popStateEvent = false;
    });
  },
});
