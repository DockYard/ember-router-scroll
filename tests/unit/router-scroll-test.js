import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';

let scrollTo, subject;

module('router-scroll', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    scrollTo = window.scrollTo;
  });

  hooks.afterEach(function () {
    window.scrollTo = scrollTo;
  });

  function getTransitionsMock(URL, isPreserveScroll) {
    Object.defineProperty(subject, 'currentURL', {
      value: URL || 'Hello/World',
    });

    const transition = {
      handler: {
        controller: {
          preserveScrollPosition: isPreserveScroll || false,
        },
      },
      router: {
        currentRouteInfos: [
          {
            route: {
              controller: {
                preserveScrollPosition: isPreserveScroll || false,
              },
            },
          },
        ],
      },
    };

    return transition;
  }

  test('when the application is FastBooted', async function (assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = true;
      }
    );
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.updateScrollPosition = () => {
      assert.notOk(true, 'it should not call updateScrollPosition.');
      done();
    };

    subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange');

    assert.ok(true, 'it should not call updateScrollPosition.');
    await settled();
    done();
  });

  test('when the application is not FastBooted', function (assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = false;
      }
    );
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.scrollWhenIdle = false;
    routerScrollService.updateScrollPosition = () => {
      assert.ok(true, 'it should call updateScrollPosition.');
      done();
    };

    subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange');
  });

  test('when the application is not FastBooted with targetElement', function (assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = false;
      }
    );
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.targetElement = '#myElement';
    routerScrollService.updateScrollPosition = () => {
      assert.ok(true, 'it should call updateScrollPosition.');
      done();
    };

    subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange');
  });

  test('when the application is not FastBooted with scrollWhenIdle', function (assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = false;
      }
    );
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.scrollWhenIdle = true;
    routerScrollService.updateScrollPosition = () => {
      assert.ok(true, 'it should call updateScrollPosition.');
      done();
    };

    subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange');
  });

  test('when the application is not FastBooted with scrollWhenAfterRender', function (assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = false;
      }
    );
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.scrollWhenAfterRender = true;
    routerScrollService.updateScrollPosition = () => {
      assert.ok(true, 'it should call updateScrollPosition.');
      done();
    };

    subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange');
  });

  test('Update Scroll Position: Position is preserved', async function (assert) {
    assert.expect(0);

    window.scrollTo = () => {
      assert.ok(false, 'Scroll To should not be called');
    };

    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = false;
      }
    );
    const routerScrollService = this.owner.lookup('service:router-scroll');
    Object.defineProperty(routerScrollService, 'position', {
      get position() {
        return { x: 0, y: 0 };
      },
    });
    routerScrollService.scrollElement = 'window';

    subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange', getTransitionsMock('Hello/World', true));
    await settled();
  });

  test('Update Scroll Position: Can preserve position using routerService', async function (assert) {
    assert.expect(0);

    window.scrollTo = () => {
      assert.ok(false, 'Scroll To should not be called');
    };

    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.preserveScrollPosition = true;

    subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange', getTransitionsMock('Hello/World', true));
    await settled();
  });

  test('Update Scroll Position: URL is an anchor', async function (assert) {
    assert.expect(2);
    const done = assert.async();

    const elem = document.createElement('div');
    elem.id = 'World';
    document.body.insertBefore(elem, null);
    window.scrollTo = (x, y) => {
      assert.strictEqual(
        x,
        elem.offsetLeft,
        `Scroll to called with correct horizontal offset x: ${x} === ${elem.offsetLeft}`
      );
      assert.strictEqual(
        y,
        elem.offsetTop,
        `Scroll to called with correct vertical offset y: ${y} === ${elem.offsetTop}`
      );
      done();
    };

    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = false;
      }
    );
    const routerScrollService = this.owner.lookup('service:router-scroll');
    routerScrollService.currentURL = '#World';
    Object.defineProperty(routerScrollService, 'position', {
      get() {
        return { x: 0, y: 0 };
      },
    });
    routerScrollService.scrollElement = 'window';

    subject = this.owner.lookup('service:router');
    subject.trigger(
      'routeDidChange',
      getTransitionsMock('Hello/#World', false)
    );
  });

  test('Update Scroll Position: URL has nothing after an anchor', function (assert) {
    assert.expect(2);
    const done = assert.async();

    window.scrollTo = (x, y) => {
      assert.strictEqual(
        x,
        1,
        'Scroll to called with correct horizontal offset'
      );
      assert.strictEqual(y, 2, 'Scroll to called with correct vertical offset');
      done();
    };

    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = false;
      }
    );
    const routerScrollService = this.owner.lookup('service:router-scroll');
    Object.defineProperty(routerScrollService, 'position', {
      value: { x: 1, y: 2 },
    });
    routerScrollService.scrollElement = 'window';

    subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange', getTransitionsMock('Hello/#'));
  });

  test('Update Scroll Position: URL has nonexistent element after anchor', function (assert) {
    assert.expect(2);
    const done = assert.async();

    const elem = document.createElement('div');
    elem.id = 'World';
    document.body.insertBefore(elem, null);
    window.scrollTo = (x, y) => {
      assert.strictEqual(
        x,
        1,
        'Scroll to called with correct horizontal offset'
      );
      assert.strictEqual(y, 2, 'Scroll to called with correct vertical offset');
      done();
    };

    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = false;
      }
    );
    const routerScrollService = this.owner.lookup('service:router-scroll');
    Object.defineProperty(routerScrollService, 'position', {
      value: { x: 1, y: 2 },
    });
    routerScrollService.scrollElement = 'window';

    subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange', getTransitionsMock('Hello/#Bar'));
  });

  test('Update Scroll Position: Scroll Position is set by service', function (assert) {
    assert.expect(2);
    const done = assert.async();

    window.scrollTo = (x, y) => {
      assert.strictEqual(
        x,
        1,
        'Scroll to called with correct horizontal offset'
      );
      assert.strictEqual(
        y,
        20,
        'Scroll to called with correct vertical offset'
      );
      done();
    };

    this.owner.register(
      'service:fastboot',
      class extends EmberObject {
        isFastBoot = false;
      }
    );
    const routerScrollService = this.owner.lookup('service:router-scroll');
    Object.defineProperty(routerScrollService, 'position', {
      value: { x: 1, y: 20 },
    });
    routerScrollService.scrollElement = 'window';

    subject = this.owner.lookup('service:router');
    subject.trigger('routeDidChange', getTransitionsMock('Hello/World'));
  });
});
