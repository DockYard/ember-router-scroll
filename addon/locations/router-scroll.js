import Ember from 'ember';

const {
  get,
  HistoryLocation,
} = Ember;

export default HistoryLocation.extend({
  init(...args) {
    this._super(...args);
    this.stateCounter = 0;
  },
  pushState(path) {
    const id = `${this.stateCounter++}`;
    const state = { path, id };
    get(this, 'history').pushState(state, null, path);
    this._previousURL = this.getURL(); // eslint-disable-line no-underscore-dangle
  },
  replaceState(path) {
    const id = `${this.stateCounter++}`;
    const state = { path, id };
    get(this, 'history').replaceState(state, null, path);
    this._previousURL = this.getURL(); // eslint-disable-line no-underscore-dangle
  },
});
