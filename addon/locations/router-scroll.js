import HistoryLocation from '@ember/routing/history-location';
import { set, get } from '@ember/object';
import { deprecate } from '@ember/application/deprecations';

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : r & 3 | 8;
  return v.toString(16);
});

export default HistoryLocation.extend({
  init() {
    this._super(...arguments);

    deprecate(
      `Setting 'locationType' to 'router-scroll' in config/environment.js is deprecated, please change it to 'auto'. If you are overriding ember-router-scroll's implementation of "pushState" or "replaceState", then you can subclass and override a new location object from: import HistoryLocation from '@ember/routing/history-location';`,
      false,
      {
        id: 'ember-router-scroll',
        until: '2.0.0'
      }
    );
  },

  pushState(path) {
    const state = { path, uuid: uuid() };
    get(this, 'history').pushState(state, null, path);
    set(this, '_previousURL', this.getURL());
  },

  replaceState(path) {
    const state = { path, uuid: uuid() };
    get(this, 'history').replaceState(state, null, path);
    set(this, '_previousURL', this.getURL());
  }
});
