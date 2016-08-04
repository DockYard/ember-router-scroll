import Ember from 'ember';

const {
  get,
  HistoryLocation
} = Ember;

export default HistoryLocation.extend({
  init(...args) {
    this._super(...args);
    this.stateCounter = 0;
  },
  pushState(path) {
    let id = `${this.stateCounter++}`;
    let state = { path, id };
    get(this, 'history').pushState(state, null, path);
    this._previousURL = this.getURL();
  },
  replaceState(path) {
    let id = `${this.stateCounter++}`;
    let state = { path, id };
    get(this, 'history').replaceState(state, null, path);
    this._previousURL = this.getURL();
  }
});
