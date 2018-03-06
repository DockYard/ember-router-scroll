/* eslint-disable */
import Service from '@ember/service';
import { getWithDefault, computed, set, get } from '@ember/object';
import { typeOf } from '@ember/utils';
import { getOwner } from '@ember/application';

export default Service.extend({
  isFastBoot: computed(function() {
    const fastboot = getOwner(this).lookup('service:fastboot');
    return fastboot ? fastboot.get('isFastBoot') : false;
  }),

  scrollElement: 'window',

  init(...args) {
    this._super(...args);
    this._loadConfig();
    set(this, 'scrollMap', {});
    set(this, 'key', null);
  },

  update() {
    const scrollElement = get(this, 'scrollElement');
    const scrollMap = get(this, 'scrollMap');
    const key = get(this, 'key');
    let x;
    let y;

    if ('window' === scrollElement) {
      x = window.scrollX;
      y = window.scrollY;
    } else if ('#' === scrollElement.charAt(0)) {
      if (get(this, 'isFastBoot')) {
        return;
      }

      let element = document.getElementById(scrollElement.substring(1));

      if (element) {
        x = element.scrollLeft;
        y = element.scrollTop;
      }
    }

    if (key && 'number' === typeOf(x) && 'number' === typeOf(y)) {
      set(scrollMap, key, { x, y });
    }
  },

  position: computed(function position() {
    const scrollMap = get(this, 'scrollMap');
    const stateUuid = get(window, 'history.state.uuid');

    set(this, 'key', stateUuid);
    const key = getWithDefault(this, 'key', '-1');

    return getWithDefault(scrollMap, key, { x: 0, y: 0 });
  }).volatile(),

  _loadConfig() {
    const config = getOwner(this).resolveRegistration('config:environment');

    if (config && config.routerScroll && config.routerScroll.scrollElement) {
      const scrollElement = config.routerScroll.scrollElement;

      if ('string' === typeOf(scrollElement)) {
        set(this, 'scrollElement', scrollElement);
      }
    }
  }
});
