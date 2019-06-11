import Service from '@ember/service';
import { getWithDefault, computed, set, get } from '@ember/object';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';

export default Service.extend({
  isFastBoot: computed(function() {
    const fastboot = getOwner(this).lookup('service:fastboot');
    return fastboot ? fastboot.get('isFastBoot') : false;
  }),

  key: null,
  scrollElement: 'window',
  targetElement: null,
  delayScrollTop: false,
  isFirstLoad: true,

  init(...args) {
    this._super(...args);
    this._loadConfig();
    set(this, 'scrollMap', { default: { x: 0, y: 0 }});
  },

  unsetFirstLoad() {
    set(this, 'isFirstLoad', false);
  },

  update() {
    if (get(this, 'isFastBoot') || get(this, 'isFirstLoad')) {
      return;
    }

    const scrollElement = get(this, 'scrollElement');
    const targetElement = get(this, 'targetElement');
    const scrollMap = get(this, 'scrollMap');
    const key = get(this, 'key');
    let x;
    let y;

    if (targetElement) {
      let element = document.querySelector(targetElement);
      if (element) {
        x = element.offsetLeft;
        y = element.offsetTop;

        // if we are looking to where to transition to next, we need to set the default to the position
        // of the targetElement on screen
        set(scrollMap, 'default', { x, y });
      }
    } else if ('window' === scrollElement) {
      x = window.scrollX;
      y = window.scrollY;
    } else if ('#' === scrollElement.charAt(0)) {
      let element = document.getElementById(scrollElement.substring(1));

      if (element) {
        x = element.scrollLeft;
        y = element.scrollTop;
      }
    }

    // only a `key` present after first load
    if (key && 'number' === typeOf(x) && 'number' === typeOf(y)) {
      set(scrollMap, key, { x, y });
    }
  },

  get position() {
    const scrollMap = get(this, 'scrollMap');
    const stateUuid = get(window, 'history.state.uuid');

    set(this, 'key', stateUuid); // eslint-disable-line ember/no-side-effects
    const key = getWithDefault(this, 'key', '-1');

    return getWithDefault(scrollMap, key, scrollMap.default);
  },

  _loadConfig() {
    const config = getOwner(this).resolveRegistration('config:environment');

    if (config && config.routerScroll) {
      const scrollElement = config.routerScroll.scrollElement;
      const targetElement = config.routerScroll.targetElement;

      assert('You defined both scrollElement and targetElement in your config. We currently only support definining one of them', !(scrollElement && targetElement));

      if ('string' === typeOf(scrollElement)) {
        set(this, 'scrollElement', scrollElement);
      }

      if ('string' === typeOf(targetElement)) {
        set(this, 'targetElement', targetElement);
      }

      const delayScrollTop = config.routerScroll.delayScrollTop;
      if (delayScrollTop === true) {
        set(this, 'delayScrollTop', true);
      }
    }
  }
});
