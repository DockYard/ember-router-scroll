import { run, next } from '@ember/runloop';
import EmberObject from '@ember/object';
import RouterScroll from 'ember-router-scroll';
import { moduleFor, test } from 'ember-qunit';

module('mixin:router-scroll');

function getSchedulerMock() {
  return {
    scheduleWork: (eventName, callback) => {
      callback();
    },
  };
}

function getTransitionsMock(URL, isPreserveScroll) {
  return [
    {
      handler: {
        controller: {
          preserveScrollPosition: isPreserveScroll || false,
        },
        router: {
          currentURL: URL || 'Hello/World',
        },
      },
    },
  ];
}

test('when the application is FastBooted', (assert) => {
  assert.expect(1);

  const done = assert.async();
  const RouterScrollObject = EmberObject.extend(RouterScroll);
  const subject = RouterScrollObject.create({
    isFastBoot: true,
    scheduler: getSchedulerMock(),
    updateScrollPosition() {
      assert.notOk(true, 'it should not call updateScrollPosition.');
      done();
    },
  });

  run(() => {
    subject.didTransition();
    next(() => {
      assert.ok(true, 'it should not call updateScrollPosition.');
      done();
    });
  });
});

test('when the application is not FastBooted', (assert) => {
  assert.expect(1);

  const done = assert.async();
  const RouterScrollObject = EmberObject.extend(RouterScroll);
  const subject = RouterScrollObject.create({
    isFastBoot: false,
    scheduler: getSchedulerMock(),
    updateScrollPosition() {
      assert.ok(true, 'it should call updateScrollPosition.');
      done();
    },
  });

  run(() => {
    subject.didTransition();
  });
});

test('Update Scroll Position: Position is preserved', (assert) => {
  assert.expect(0);
  window.scrollTo = () => assert.ok(false, 'Scroll To should not be called');

  const RouterScrollObject = EmberObject.extend(RouterScroll);
  const subject = RouterScrollObject.create({
    isFastBoot: false,
    scheduler: getSchedulerMock(),
  });

  run(() => {
    subject.didTransition(getTransitionsMock('Hello/World', true));
  });
});

test('Update Scroll Position: URL is an anchor', (assert) => {
  assert.expect(2);
  document.getElementById = (id) => {
    assert.ok(id === 'World', 'Id is properly is parsed');
    return { offsetLeft: 1, offsetTop: 2 };
  };
  window.scrollTo = (x, y) =>
    assert.ok(x === 1 && y === 2, 'Scroll to called with correct offsets');

  const RouterScrollObject = EmberObject.extend(RouterScroll);
  const subject = RouterScrollObject.create({
    isFastBoot: false,
    scheduler: getSchedulerMock(),
  });

  run(() => {
    subject.didTransition(getTransitionsMock('Hello/#World'));
  });
});

test('Update Scroll Position: Scroll Position is set by service', (assert) => {
  assert.expect(1);
  window.scrollTo = (x, y) =>
    assert.ok(x === 1 && y === 2, 'Scroll to called with correct offsets');

  const RouterScrollObject = EmberObject.extend(RouterScroll);
  const subject = RouterScrollObject.create({
    isFastBoot: false,
    scheduler: getSchedulerMock(),
    service: {
      position: { x: 1, y: 2 },
    },
  });

  run(() => {
    subject.didTransition(getTransitionsMock('Hello/World'));
  });
});

test('Update Scroll Position: Scroll Element is set by scroll element', (assert) => {
  assert.expect(2);

  const elem = { scrollLeft: 0, scrollTop: 0 };
  document.getElementById = (id) => {
    assert.ok(id === 'World', 'Id is properly is parsed');
    return elem;
  };

  const RouterScrollObject = EmberObject.extend(RouterScroll);
  const subject = RouterScrollObject.create({
    isFastBoot: false,
    scheduler: getSchedulerMock(),
    service: {
      scrollElement: '#World',
      position: { x: 1, y: 2 },
    },
  });

  run(() => {
    subject.didTransition(getTransitionsMock('Hello/World'));
    assert.ok(
      elem.scrollLeft === 1 && elem.scrollTop === 2,
      'Element scroll left and top is set by the service'
    );
  });
});
