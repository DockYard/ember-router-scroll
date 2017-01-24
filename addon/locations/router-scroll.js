import Ember from 'ember';

function _uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r, v;
    r = Math.random() * 16 | 0;
    v = c === 'x' ? r : r & 3 | 8;
    return v.toString(16);
  });
}

const {
  get,
  HistoryLocation,
} = Ember;

export default HistoryLocation.extend({
  pushState(path) {
    const uuid = _uuid();
    const state = { path, uuid };
    get(this, 'history').pushState(state, null, path);
    this._previousURL = this.getURL(); // eslint-disable-line no-underscore-dangle
  },
  replaceState(path) {
    const uuid = _uuid();
    const state = { path, uuid };
    get(this, 'history').replaceState(state, null, path);
    this._previousURL = this.getURL(); // eslint-disable-line no-underscore-dangle
  },
});
