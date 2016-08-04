import Ember from 'ember';
import RouterScroll from 'ember-router-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | router scroll');

// Replace this with your real tests.
test('it works', (assert) => {
  const RouterScrollObject = Ember.Object.extend(RouterScroll);
  const subject = RouterScrollObject.create();
  assert.ok(subject);
});
