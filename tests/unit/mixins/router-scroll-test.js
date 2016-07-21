import Ember from 'ember';
import RouterScrollMixin from 'ember-router-scroll/mixins/router-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | router scroll');

// Replace this with your real tests.
test('it works', function(assert) {
  let RouterScrollObject = Ember.Object.extend(RouterScrollMixin);
  let subject = RouterScrollObject.create();
  assert.ok(subject);
});
