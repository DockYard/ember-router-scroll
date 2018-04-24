import HistoryLocation from '@ember/routing/history-location';
import { set, get } from '@ember/object';

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : r & 3 | 8;
  return v.toString(16);
});

export default HistoryLocation.extend({
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
