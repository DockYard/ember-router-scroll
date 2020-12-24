import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';

let scrollTo, subject;

module('router-scroll', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    scrollTo = window.scrollTo;
  });

  hooks.afterEach(function() {
    window.scrollTo = scrollTo;
  });

  function getTransitionsMock(URL, isPreserveScroll) {
    subject.set('currentURL', URL || 'Hello/World');

    const transition = {
      handler: {
        controller: {
          preserveScrollPosition: isPreserveScroll || false
        }
      },
      router: {
        currentRouteInfos: [
          {
            route: {
              controller: {
                preserveScrollPosition: isPreserveScroll || false
              }
            }
          }
        ]
      }
    };

    return transition;
  }

  test('when the application is FastBooted', async function(assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: true }));
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.updateScrollPosition = () => {
      assert.notOk(true, 'it should not call updateScrollPosition.');
      done();
    }

    const subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange');

    assert.ok(true, 'it should not call updateScrollPosition.');
    await settled();
    done();
  });

  test('when the application is not FastBooted', function(assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.scrollWhenIdle = false;
    routerScrollService.updateScrollPosition = () => {
      assert.ok(true, 'it should call updateScrollPosition.');
      done();
    }

    const subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange');
  });

  test('when the application is not FastBooted with targetElement', function(assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.targetElement = '#myElement';
    routerScrollService.updateScrollPosition = () => {
      assert.ok(true, 'it should call updateScrollPosition.');
      done();
    }

    const subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange');
  });

  test('when the application is not FastBooted with scrollWhenIdle', function(assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.scrollWhenIdle = true;
    routerScrollService.updateScrollPosition = () => {
      assert.ok(true, 'it should call updateScrollPosition.');
      done();
    }

    const subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange');
  });

  test('when the application is not FastBooted with scrollWhenAfterRender', function(assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.scrollWhenAfterRender = true;
    routerScrollService.updateScrollPosition = () => {
      assert.ok(true, 'it should call updateScrollPosition.');
      done();
    }

    const subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange');
  });

  test('Update Scroll Position: Position is preserved', function(assert) {
    assert.expect(0);
    const done = assert.async();

    window.scrollTo = () => {
      assert.ok(false, 'Scroll To should not be called');
      done();
    }

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.position = null;
    routerScrollService.scrollElement = 'window';

    const subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange', getTransitionsMock('Hello/World', true));
  });

  test('Update Scroll Position: Can preserve position using routerService', function(assert) {
    assert.expect(0);
    const done = assert.async();

    window.scrollTo = () => {
      assert.ok(false, 'Scroll To should not be called');
      done();
    }

    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.preserveScrollPosition = true;

    const subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange', getTransitionsMock('Hello/World', true));
  });

  test('Update Scroll Position: URL is an anchor', async function(assert) {
    assert.expect(1);
    const done = assert.async();

    const elem = document.createElement('div');
    elem.id = 'World';
    document.body.insertBefore(elem, null);
    window.scrollTo = (x, y) => {
      assert.ok(x === elem.offsetLeft && y === elem.offsetTop, 'Scroll to called with correct offsets');
      done();
    }

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.position = null;
    routerScrollService.scrollElement = 'window';

    subject = this.owner.factoryFor('service:router-scroll').create();

    run(() => {
      subject.trigger('routeDidChange', getTransitionsMock('Hello/#World', false));
    });
  });

  test('Ensure correct internal router intimate api is used: _router', function(assert) {
    assert.expect(1);
    const done = assert.async();

    const elem = document.createElement('div');
    elem.id = 'World';
    document.body.insertBefore(elem, null);
    window.scrollTo = (x, y) => {
      assert.ok(x === elem.offsetLeft && y === elem.offsetTop, 'Scroll to called with correct offsets');
      done();
    }

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.position = null;
    routerScrollService.scrollElement = 'window';

    subject = this.owner.factoryFor('service:router-scroll').create();

    run(() => {
      subject.trigger('routeDidChange', getTransitionsMock('Hello/#World', false));
    });
  });

  test('Update Scroll Position: URL has nothing after an anchor', function(assert) {
    assert.expect(1);
    const done = assert.async();

    window.scrollTo = (x, y) => {
      assert.ok(x === 1 && y === 2, 'Scroll to called with correct offsets');
      done();
    }

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.position = { x: 1, y: 2, };
    routerScrollService.scrollElement = 'window';

    subject = this.owner.factoryFor('service:router-scroll').create();

    run(() => {
      subject.trigger('routeDidChange', getTransitionsMock('Hello/#'));
    })
  });

  test('Update Scroll Position: URL has nonexistent element after anchor', function(assert) {
    assert.expect(1);
    const done = assert.async();

    const elem = document.createElement('div');
    elem.id = 'World';
    document.body.insertBefore(elem, null);
    window.scrollTo = (x, y) => {
      assert.ok(x === 1 && y === 2, 'Scroll to called with correct offsets');
      done();
    }

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.position = { x: 1, y: 2, };
    routerScrollService.scrollElement = 'window';

    subject = this.owner.factoryFor('service:router-scroll').create();

    run(() => {
      subject.trigger('routeDidChange', getTransitionsMock('Hello/#Bar'));
    });
  });

  test('Update Scroll Position: Scroll Position is set by service', function(assert) {
    assert.expect(1);
    const done = assert.async();

    window.scrollTo = (x, y) => {
      assert.ok(x === 1 && y === 20, 'Scroll to was called with correct offsets');
      done();
    }

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.position = { x: 1, y: 20, };
    routerScrollService.scrollElement = 'window';

    subject = this.owner.factoryFor('service:router-scroll').create();

    run(() => {
      subject.trigger('routeDidChange', getTransitionsMock('Hello/World'));
    });
  });
});
