import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const {
  get,
  set
} = Ember;

moduleFor('service:router-scroll', 'Unit | Service | router scroll', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Replace this with your real tests.
test('it inits `scrollMap` and `key`', function(assert) {
  let service = this.subject();
  assert.deepEqual(get(service, 'scrollMap'), {});
  assert.deepEqual(get(service, 'key'), null);
});

test('updating will set `scrollMap` to the current scroll position', function(assert) {
  let service = this.subject();

  let expected = { x: window.scrollX, y: window.scrollY };
  set(service, 'key', '123');
  service.update();
  assert.deepEqual(get(service, 'scrollMap'), { '123': expected });
});

test('updating will not set `scrollMap` to the current scroll position if `key` is not yet set', function(assert) {
  let service = this.subject();

  service.update();
  assert.deepEqual(get(service, 'scrollMap'), { });
});

test('computing the position for an existing state id return the coords', function(assert) {
  let service = this.subject();
  let state = window.history.state;
  window.history.replaceState({id: '123'}, null);

  let expected = { x: 1, y: 1 };
  set(service, 'scrollMap.123', expected);
  assert.deepEqual(get(service, 'position'), expected);
  window.history.replaceState(state, null);
});

test('computing the position for a state without a cached scroll position returns default', function(assert) {
  let service = this.subject();
  let state = window.history.state;
  window.history.replaceState({id: '123'}, null);

  let expected = { x: 0, y: 0 };
  assert.deepEqual(get(service, 'position'), expected);
  window.history.replaceState(state, null);
});

test('computing the position for a non-existing state returns default', function(assert) {
  let service = this.subject();

  let expected = { x: 0, y: 0 };
  assert.deepEqual(get(service, 'position'), expected);
});
