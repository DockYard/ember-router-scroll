import { set, get } from '@ember/object';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:router-scroll');

test('it inits `scrollMap` and `key`', function init(assert) {
  const service = this.subject();
  assert.deepEqual(get(service, 'scrollMap'), {});
  assert.deepEqual(get(service, 'key'), null);
});

test('it inits `scrollMap` and `key` with scrollElement other than window', function init(assert) {
  const service = this.subject({ scrollElement: '#other-elem' });
  assert.deepEqual(get(service, 'scrollMap'), {});
  assert.deepEqual(get(service, 'key'), null);
});

test('updating will not set `scrollMap` to the current scroll position if `key` is not yet set',
function scrollMapCurrentPos(assert) {
  const service = this.subject();

  service.update();
  assert.deepEqual(get(service, 'scrollMap'), { });
});

test('updating will set `scrollMap` to the current scroll position', function scrollMap(assert) {
  const service = this.subject();

  const expected = { x: window.scrollX, y: window.scrollY };
  set(service, 'key', '123');
  service.update();
  assert.deepEqual(get(service, 'scrollMap'), { 123: expected });
});

test('updating will not set `scrollMap` if scrollElement is defined',
function scrollMapCurrentPos(assert) {
  const service = this.subject({ scrollElement: '#other-elem' });

  service.update();
  const expected = { x: 0, y: 0 };
  assert.deepEqual(get(service, 'position'), expected);
  assert.deepEqual(get(service, 'scrollMap'), { });
});

test('updating will not set `scrollMap` if scrollElement is defined and in fastboot',
function scrollMapCurrentPos(assert) {
  const otherElem = document.createElement('div');
  otherElem.setAttribute('id', 'other-elem');
  const testing = document.querySelector('#ember-testing');
  testing.appendChild(otherElem);
  const service = this.subject({ scrollElement: '#other-elem', isFastBoot: true });
  window.history.replaceState({ uuid: '123' }, null);

  let expected = { x: 0, y: 0 };
  assert.deepEqual(get(service, 'position'), expected, 'position is defaulted');
  service.update();
  assert.deepEqual(get(service, 'scrollMap'), { }, 'does not set scrollMap b/c in fastboot');
});

test('updating will set `scrollMap` if scrollElement is defined',
function scrollMapCurrentPos(assert) {
  const otherElem = document.createElement('div');
  otherElem.setAttribute('id', 'other-elem');
  const testing = document.querySelector('#ember-testing');
  testing.appendChild(otherElem);
  const service = this.subject({ scrollElement: '#other-elem' });
  window.history.replaceState({ uuid: '123' }, null);

  let expected = { x: 0, y: 0 };
  assert.deepEqual(get(service, 'position'), expected, 'position is defaulted');
  service.update();
  assert.deepEqual(get(service, 'scrollMap'), { '123': expected }, 'sets scrollMap');
});

test('computing the position for an existing state uuid return the coords',
function existingUUID(assert) {
  const service = this.subject();
  window.history.replaceState({ uuid: '123' }, null);

  const expected = { x: 1, y: 1 };
  set(service, 'scrollMap.123', expected);
  assert.deepEqual(get(service, 'position'), expected);
});

test('computing the position for a state without a cached scroll position returns default',
function cachedScroll(assert) {
  const service = this.subject();
  const state = window.history.state;
  window.history.replaceState({ uuid: '123' }, null);

  const expected = { x: 0, y: 0 };
  assert.deepEqual(get(service, 'position'), expected);
  window.history.replaceState(state, null);
});

test('computing the position for a non-existant state returns default',
function nonExistantState(assert) {
  const service = this.subject();

  const expected = { x: 0, y: 0 };
  assert.deepEqual(get(service, 'position'), expected);
});
