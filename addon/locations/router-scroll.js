import HistoryLocation from '@ember/routing/history-location';
import { set, get } from '@ember/object';
import { deprecate } from '@ember/application/deprecations';

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : r & 3 | 8;
  return v.toString(16);
});

export default HistoryLocation.extend({
  pushState(path) {
    deprecate(
      `If you are overriding ember-router-scroll's implementation of "pushState", then you can import and override a new location object like so: import HistoryLocation from '@ember/routing/history-location';`,
      false,
      {
        id: 'ember-router-scroll',
        until: '2.0.0'
      }
    );

    const state = { path, uuid: uuid() };
    get(this, 'history').pushState(state, null, path);
    set(this, '_previousURL', this.getURL());
  },

  replaceState(path) {
    deprecate(
      `If you are overriding ember-router-scroll's implementation of "replaceState", then you can import and override a new location object like so: import HistoryLocation from '@ember/routing/history-location';`,
      false,
      {
        id: 'ember-router-scroll',
        until: '2.0.0'
      }
    );

    const state = { path, uuid: uuid() };
    get(this, 'history').replaceState(state, null, path);
    set(this, '_previousURL', this.getURL());
  }
});
