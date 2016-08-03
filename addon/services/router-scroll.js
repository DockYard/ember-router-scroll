import Ember from 'ember';

const {
  get,
  set,
  computed,
  getWithDefault,
  Service
} = Ember;

export default Service.extend({
  init(...args) {
    this._super(...args);
    set(this, 'scrollMap', {});
    set(this, 'key', null);
  },
  update() {
    let scrollMap = get(this, 'scrollMap');
    let key       = get(this, 'key');

    if (key) {
      set(scrollMap, key, { x: window.scrollX, y: window.scrollY });
    }
  },
  position: computed(function() {
    let scrollMap = get(this, 'scrollMap');
    let stateId   = get(window, 'history.state.id');

    set(this, 'key', stateId);
    let key = getWithDefault(this, 'key', '-1');

    return getWithDefault(scrollMap, key, { x: 0, y: 0 });
  }).volatile()
});
