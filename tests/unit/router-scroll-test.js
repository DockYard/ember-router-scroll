import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';
import EmberRouterScroll from 'ember-router-scroll';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';
import { gte } from 'ember-compatibility-helpers';

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

    return gte('3.6.0-beta.1') ? transition : [transition];
  }

  test('when the application is FastBooted', async function(assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: true }));
    this.owner.register('router:main', EmberRouterScroll.extend({
      updateScrollPosition() {
        assert.notOk(true, 'it should not call updateScrollPosition.');
        done();
      }
    }));

    subject = this.owner.factoryFor('router:main').create();

    if(gte('3.6.0-beta.1')) {
      subject.trigger('routeDidChange');
    } else {
      subject.didTransition();
    }

    assert.ok(true, 'it should not call updateScrollPosition.');
    await settled();
    done();
  });

  test('when the application is not FastBooted', function(assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    this.owner.register('service:router-scroll', EmberObject.extend({ scrollWhenIdle: false }));
    this.owner.register('router:main', EmberRouterScroll.extend({
      updateScrollPosition() {
        assert.ok(true, 'it should call updateScrollPosition.');
        done();
      }
    }));

    subject = this.owner.factoryFor('router:main').create();

    run(() => {
      if(gte('3.6.0-beta.1')) {
        subject.trigger('routeDidChange');
      } else {
        subject.didTransition();
      }
    });
  });

  test('when the application is not FastBooted with targetElement', function(assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    this.owner.register('service:router-scroll', EmberObject.extend({ targetElement: '#myElement' }));
    this.owner.register('router:main', EmberRouterScroll.extend({
      updateScrollPosition() {
        assert.ok(true, 'it should call updateScrollPosition.');
        done();
      }
    }));

    subject = this.owner.factoryFor('router:main').create();

    run(() => {
      if(gte('3.6.0-beta.1')) {
        subject.trigger('routeDidChange');
      } else {
        subject.didTransition();
      }
    });
  });

  test('when the application is not FastBooted with scrollWhenIdle', function(assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    this.owner.register('service:router-scroll', EmberObject.extend({ scrollWhenIdle: true }));
    this.owner.register('router:main', EmberRouterScroll.extend({
      updateScrollPosition() {
        assert.ok(true, 'it should call updateScrollPosition.');
        done();
      }
    }));

    subject = this.owner.factoryFor('router:main').create();

    run(() => {
      subject.trigger('routeDidChange');
    });
  });

  test('when the application is not FastBooted with scrollWhenAfterRender', function(assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    this.owner.register('service:router-scroll', EmberObject.extend({ scrollWhenAfterRender: true }));
    this.owner.register('router:main', EmberRouterScroll.extend({
      updateScrollPosition() {
        assert.ok(true, 'it should call updateScrollPosition.');
        done();
      }
    }));

    subject = this.owner.factoryFor('router:main').create();

    run(() => {
      subject.trigger('routeDidChange');
    });
  });

  test('Update Scroll Position: Position is preserved', function(assert) {
    assert.expect(0);
    const done = assert.async();

    window.scrollTo = () => assert.ok(false, 'Scroll To should not be called');

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    this.owner.register('service:router-scroll', EmberObject.extend({
      position: null,
      scrollElement: 'window'
    }));
    this.owner.register('router:main', EmberRouterScroll.extend());

    subject = this.owner.factoryFor('router:main').create();

    run(() => {
      if(gte('3.6.0-beta.1')) {
        subject.trigger('routeDidChange', getTransitionsMock('Hello/World', true));
      } else {
        subject.didTransition(getTransitionsMock('Hello/World', true));
      }
      done();
    });
  });

  test('when the application is not FastBooted with scrollWhenPainted', function(assert) {
    assert.expect(1);
    const done = assert.async();

    this.owner.register('service:fastboot', EmberObject.extend({ isFastBoot: false }));
    this.owner.register('service:router-scroll', EmberObject.extend({ scrollWhenPainted: true }));
    this.owner.register('router:main', EmberRouterScroll.extend({
      updateScrollPosition() {
        assert.ok(true, 'it should call updateScrollPosition.');
        done();
      }
    }));

    subject = this.owner.factoryFor('router:main').create();

    run(() => {
      if(gte('3.6.0-beta.1')) {
        subject.trigger('routeDidChange');
      } else {
        subject.didTransition();
      }
    });
  });

  test('Update Scroll Position: Can preserve position using routerService', function(assert) {
    assert.expect(0);
    const done = assert.async();

    window.scrollTo = () => assert.ok(false, 'Scroll To should not be called');

    const EmberRouterScrollObject = EmberRouterScroll.extend();
    subject = EmberRouterScrollObject.create({
      isFastBoot: false,
      service: {
        position: null,
        scrollElement: 'window',
      }
    });

    run(() => {
      subject.service.preserveScrollPosition = true;

      if(gte('3.6.0-beta.1')) {
        subject.trigger('routeDidChange', getTransitionsMock('Hello/World', false));
      } else {
        subject.didTransition(getTransitionsMock('Hello/World', false));
      }
      done();
    });
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
    this.owner.register('service:router-scroll', EmberObject.extend({
      position: null,
      scrollElement: 'window'
    }));
    this.owner.register('router:main', EmberRouterScroll.extend(Evented));

    subject = this.owner.factoryFor('router:main').create();

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
    this.owner.register('service:router-scroll', EmberObject.extend({
      position: null,
      scrollElement: 'window'
    }));
    this.owner.register('router:main', EmberRouterScroll.extend());

    subject = this.owner.factoryFor('router:main').create();

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
    this.owner.register('service:router-scroll', EmberObject.extend({
      get position() {
        return { x: 1, y: 2 };
      },
      scrollElement: 'window'
    }));
    this.owner.register('router:main', EmberRouterScroll.extend());

    subject = this.owner.factoryFor('router:main').create();

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
    this.owner.register('service:router-scroll', EmberObject.extend({
      get position() {
        return { x: 1, y: 2 };
      },
      scrollElement: 'window'
    }));
    this.owner.register('router:main', EmberRouterScroll.extend());

    subject = this.owner.factoryFor('router:main').create();

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
    this.owner.register('service:router-scroll', EmberObject.extend({
      get position() {
        return { x: 1, y: 20 };
      },
      scrollElement: 'window'
    }));
    this.owner.register('router:main', EmberRouterScroll.extend());

    subject = this.owner.factoryFor('router:main').create();

    run(() => {
      subject.trigger('routeDidChange', getTransitionsMock('Hello/World'));
    });
  });
});
