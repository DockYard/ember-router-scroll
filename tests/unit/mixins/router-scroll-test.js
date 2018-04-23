import { run, next } from '@ember/runloop';
import EmberObject from '@ember/object';
import RouterScroll from 'ember-router-scroll';
import { module, test } from 'qunit';

let scrollTo;

module('mixin:router-scroll', function(hooks) {
  hooks.beforeEach(function() {
    scrollTo = window.scrollTo;
  });

  hooks.afterEach(function() {
    window.scrollTo = scrollTo;
  });

  function getSchedulerMock() {
    return {
      scheduleWork: (eventName, callback) => {
        callback();
      },
    };
  }

  function getTransitionsMock (URL, isPreserveScroll, hasIntimateRouterAPI) {
    return [
      {
        handler: {
          controller: {
            preserveScrollPosition: isPreserveScroll || false,
          },
          [hasIntimateRouterAPI ? '_router' : 'router']: {
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
      service: {
        delayScrollTop: false,
      },
      updateScrollPosition () {
        assert.ok(true, 'it should call updateScrollPosition.');
        done();
      },
    });

    run(() => {
      subject.didTransition();
    });
  });

  test('when the application is not FastBooted with delayScrollTop', (assert) => {
    assert.expect(1);

    const done = assert.async();
    const RouterScrollObject = EmberObject.extend(RouterScroll);
    const subject = RouterScrollObject.create({
      isFastBoot: false,
      scheduler: getSchedulerMock(),
      service: {
        delayScrollTop: true,
      },
      updateScrollPosition () {
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
    const done = assert.async();

    window.scrollTo = () => assert.ok(false, 'Scroll To should not be called');

    const RouterScrollObject = EmberObject.extend(RouterScroll);
    const subject = RouterScrollObject.create({
      isFastBoot: false,
      scheduler: getSchedulerMock(),
      service: {
        position: null,
        scrollElement: 'window',
      },
    });

    run(() => {
      subject.didTransition(getTransitionsMock('Hello/World', true));
      done();
    });
  });

  test('Update Scroll Position: URL is an anchor', (assert) => {
    assert.expect(1);
    const done = assert.async();

    const elem = document.createElement('div');
    elem.id = 'World';
    document.body.insertBefore(elem, null);
    window.scrollTo = (x, y) =>
      assert.ok(x === elem.offsetLeft && y === elem.offsetTop, 'Scroll to called with correct offsets');

    const RouterScrollObject = EmberObject.extend(RouterScroll);
    const subject = RouterScrollObject.create({
      isFastBoot: false,
      scheduler: getSchedulerMock(),
      service: {
        position: null,
        scrollElement: 'window',
      },
    });

    run(() => {
      subject.didTransition(getTransitionsMock('Hello/#World', false, false));
      done();
    });
  });

  test('Ensure correct internal router intimate api is used: _router', (assert) => {
    assert.expect(1);
    const done = assert.async();

    const elem = document.createElement('div');
    elem.id = 'World';
    document.body.insertBefore(elem, null);
    window.scrollTo = (x, y) =>
      assert.ok(x === elem.offsetLeft && y === elem.offsetTop, 'Scroll to called with correct offsets');

    const RouterScrollObject = EmberObject.extend(RouterScroll);
    const subject = RouterScrollObject.create({
      isFastBoot: false,
      scheduler: getSchedulerMock(),
      service: {
        position: null,
        scrollElement: 'window',
      },
    });

    run(() => {
      subject.didTransition(getTransitionsMock('Hello/#World', false, true));
      done();
    });
  });

  test('Update Scroll Position: URL has nothing after an anchor', (assert) => {
    assert.expect(1);
    const done = assert.async();

    window.scrollTo = (x, y) =>
      assert.ok(x === 1 && y === 2, 'Scroll to called with correct offsets');

    const RouterScrollObject = EmberObject.extend(RouterScroll);
    const subject = RouterScrollObject.create({
      isFastBoot: false,
      scheduler: getSchedulerMock(),
      service: {
        position: { x: 1, y: 2 },
        scrollElement: 'window',
      },
    });

    run(() => {
      subject.didTransition(getTransitionsMock('Hello/#'));
      done();
    });
  });

  test('Update Scroll Position: URL has nonexistent element after anchor', (assert) => {
    assert.expect(1);
    const done = assert.async();

    const elem = document.createElement('div');
    elem.id = 'World';
    document.body.insertBefore(elem, null);
    window.scrollTo = (x, y) =>
      assert.ok(x === 1 && y === 2, 'Scroll to called with correct offsets');

    const RouterScrollObject = EmberObject.extend(RouterScroll);
    const subject = RouterScrollObject.create({
      isFastBoot: false,
      scheduler: getSchedulerMock(),
      service: {
        position: { x: 1, y: 2 },
        scrollElement: 'window',
      },
    });

    run(() => {
      subject.didTransition(getTransitionsMock('Hello/#Bar'));
      done();
    });
  });

  test('Update Scroll Position: Scroll Position is set by service', (assert) => {
    assert.expect(1);
    const done = assert.async();

    window.scrollTo = (x, y) =>
      assert.ok(x === 1 && y === 2, 'Scroll to was called with correct offsets');

    const RouterScrollObject = EmberObject.extend(RouterScroll);
    const subject = RouterScrollObject.create({
      isFastBoot: false,
      scheduler: getSchedulerMock(),
      service: {
        position: { x: 1, y: 2 },
        scrollElement: 'window',
      },
    });

    run(() => {
      subject.didTransition(getTransitionsMock('Hello/World'));
      next(() => {
        done()
      })
    })
  })
})
