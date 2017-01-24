/* global window */
import Ember from 'ember';

const {
  get,
  set,
  computed,
  getWithDefault,
  Service,
} = Ember;

export default Service.extend({
  init(...args) {
    this._super(...args);
    set(this, 'scrollMap', {});
    set(this, 'key', null);
  },

  update() {
    const scrollMap = get(this, 'scrollMap');
    const key = get(this, 'key');

    if (key) {
      set(scrollMap, key, { x: window.scrollX, y: window.scrollY });
    }
  },

  position: computed(function position() {
    let scrollMap = get(this, 'scrollMap');
    let stateUuid = get(window, 'history.state.uuid');

    set(this, 'key', stateUuid);
    let key = getWithDefault(this, 'key', '-1');

    return getWithDefault(scrollMap, key, { x: 0, y: 0 });
  }).volatile(),
});
