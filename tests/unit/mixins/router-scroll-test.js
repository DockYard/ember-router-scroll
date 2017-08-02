import Ember from 'ember';
import RouterScroll from 'ember-router-scroll';
import { module, test } from 'qunit';

module('mixin:router-scroll');

function getSchedulerMock() {
  return {
    scheduleWork: ((eventName, callback) => {
      callback();
    }),
  };
}

test('when the application is FastBooted', (assert) => {
  assert.expect(1);

  const done = assert.async();
  const RouterScrollObject = Ember.Object.extend(RouterScroll);
  const subject = RouterScrollObject.create({
    isFastBoot: true,
    scheduler: getSchedulerMock(),
    updateScrollPosition() {
      assert.notOk(true, 'it should not call updateScrollPosition.');
      done();
    },
  });

  Ember.run(() => {
    subject.didTransition();
    Ember.run.next(() => {
      assert.ok(true, 'it should not call updateScrollPosition.');
      done();
    });
  });
});

test('when the application is not FastBooted', (assert) => {
  assert.expect(1);

  const done = assert.async();
  const RouterScrollObject = Ember.Object.extend(RouterScroll);
  const subject = RouterScrollObject.create({
    isFastBoot: false,
    scheduler: getSchedulerMock(),
    updateScrollPosition() {
      assert.ok(true, 'it should call updateScrollPosition.');
      done();
    },
  });

  Ember.run(() => {
    subject.didTransition();
  });
});
