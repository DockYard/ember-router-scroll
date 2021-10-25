import EmberObject, { set } from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const defaultScrollMap = {
  default: {
    x: 0,
    y: 0,
  },
};

module('service:router-scroll', function (hooks) {
  setupTest(hooks);

  test('it inits `scrollMap` and `key`', function (assert) {
    const service = this.owner.lookup('service:router-scroll');
    assert.deepEqual(service.scrollMap, defaultScrollMap);
    assert.deepEqual(service.key, undefined);
  });

  test('it inits `scrollMap` and `key` with scrollElement other than window', function (assert) {
    const service = this.owner
      .factoryFor('service:router-scroll')
      .create({ scrollElement: '#other-elem' });
    assert.deepEqual(service.scrollMap, defaultScrollMap);
    assert.deepEqual(service.key, undefined);
  });

  test('updating will not set `scrollMap` to the current scroll position if `key` is not yet set', function (assert) {
    const service = this.owner.lookup('service:router-scroll');

    service.update();
    assert.deepEqual(service.scrollMap, defaultScrollMap);
  });

  test('updating will set `scrollMap` to the current scroll position', function (assert) {
    const service = this.owner
      .factoryFor('service:router-scroll')
      .create({ isFirstLoad: false });

    const expected = { x: window.scrollX, y: window.scrollY };
    set(service, 'key', '123');
    service.update();
    assert.deepEqual(service.scrollMap, {
      123: expected,
      default: { x: 0, y: 0 },
    });
  });

  test('updating will not set `scrollMap` if scrollElement is defined and element is not found', function (assert) {
    const service = this.owner
      .factoryFor('service:router-scroll')
      .create({ scrollElement: '#other-elem' });

    service.update();
    const expected = { x: 0, y: 0 };
    assert.deepEqual(service.position, expected);
    assert.deepEqual(service.scrollMap, defaultScrollMap);
  });

  test('updating will not set `scrollMap` if targetElement is defined and element is not found', function (assert) {
    const service = this.owner
      .factoryFor('service:router-scroll')
      .create({ targetElement: '#other-elem' });

    service.update();
    const expected = { x: 0, y: 0 };
    assert.deepEqual(service.position, expected);
    assert.deepEqual(service.scrollMap, defaultScrollMap);
  });

  test('updating will not set `scrollMap` if scrollElement is defined and in fastboot', function (assert) {
    const otherElem = document.createElement('div');
    otherElem.setAttribute('id', 'other-elem');
    const testing = document.querySelector('#ember-testing');
    testing.appendChild(otherElem);
    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = true;
      }
    );
    const service = this.owner
      .factoryFor('service:router-scroll')
      .create({ scrollElement: '#other-elem' });
    window.history.replaceState({ uuid: '123' }, null);

    let expected = { x: 0, y: 0 };
    assert.deepEqual(service.position, expected, 'position is defaulted');
    service.update();
    assert.deepEqual(
      service.scrollMap,
      defaultScrollMap,
      'does not set scrollMap b/c in fastboot'
    );
  });

  test('updating will not set `scrollMap` if targetElement is defined and in fastboot', function (assert) {
    const otherElem = document.createElement('div');
    otherElem.setAttribute('id', 'other-elem');
    const testing = document.querySelector('#ember-testing');
    testing.appendChild(otherElem);
    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = true;
      }
    );
    const service = this.owner
      .factoryFor('service:router-scroll')
      .create({ targetElement: '#other-elem' });
    window.history.replaceState({ uuid: '123' }, null);

    let expected = { x: 0, y: 0 };
    assert.deepEqual(service.position, expected, 'position is defaulted');
    service.update();
    assert.deepEqual(
      service.scrollMap,
      defaultScrollMap,
      'does not set scrollMap b/c in fastboot'
    );
  });

  test('updating will set `scrollMap` if scrollElement is defined', function (assert) {
    const otherElem = document.createElement('div');
    otherElem.setAttribute('id', 'other-elem');
    const testing = document.querySelector('#ember-testing');
    testing.appendChild(otherElem);
    const service = this.owner
      .factoryFor('service:router-scroll')
      .create({ isFirstLoad: false, scrollElement: '#other-elem' });
    window.history.replaceState({ uuid: '123' }, null);

    let expected = { x: 0, y: 0 };
    assert.deepEqual(service.position, expected, 'position is defaulted');
    service.update();
    assert.deepEqual(
      service.scrollMap,
      {
        123: expected,
        default: { x: 0, y: 0 },
      },
      'sets scrollMap'
    );
  });

  test('updating will set default `scrollMap` if targetElement is defined', function (assert) {
    const otherElem = document.createElement('div');
    otherElem.setAttribute('id', 'other-elem');
    otherElem.style.position = 'relative';
    otherElem.style.top = '100px';
    const testing = document.querySelector('#ember-testing');
    testing.appendChild(otherElem);
    const service = this.owner
      .factoryFor('service:router-scroll')
      .create({ isFirstLoad: false, targetElement: '#other-elem' });
    window.history.replaceState({ uuid: '123' }, null);

    let expected = { x: 0, y: 0 };
    assert.deepEqual(service.position, expected, 'position is defaulted');
    service.update();
    assert.deepEqual(
      service.scrollMap,
      { 123: { x: 0, y: 100 }, default: { x: 0, y: 100 } },
      'sets scrollMap'
    );
  });

  test('computing the position for an existing state uuid return the coords', function (assert) {
    const service = this.owner.lookup('service:router-scroll');
    window.history.replaceState({ uuid: '123' }, null);

    const expected = { x: 1, y: 1 };
    set(service, 'scrollMap.123', expected);
    assert.deepEqual(service.position, expected);
  });

  test('computing the position for a state without a cached scroll position returns default', function (assert) {
    const service = this.owner.lookup('service:router-scroll');
    const state = window.history.state;
    window.history.replaceState({ uuid: '123' }, null);

    const expected = { x: 0, y: 0 };
    assert.deepEqual(service.position, expected);
    window.history.replaceState(state, null);
  });

  test('computing the position for a non-existant state returns default', function (assert) {
    const service = this.owner.lookup('service:router-scroll');

    const expected = { x: 0, y: 0 };
    assert.deepEqual(service.position, expected);
  });
});
