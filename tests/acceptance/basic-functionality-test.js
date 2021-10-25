import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import config from 'dummy/config/environment';

module('Acceptance | basic functionality', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    document.getElementById('ember-testing-container').scrollTop = 0;
  });

  hooks.afterEach(function () {
    config['routerScroll'] = {};
  });

  test('The application should work when loading a page and clicking a link', async function (assert) {
    config['routerScroll'] = {
      scrollElement: '#ember-testing-container',
    };

    await visit('/');

    // testing specific
    let container = document.getElementById('ember-testing-container');
    assert.strictEqual(container.scrollTop, 0);

    document.getElementById('monster').scrollIntoView(false);
    assert.ok(container.scrollTop > 0);

    await click('a[href="/next-page"]');
    assert.strictEqual(currentURL(), '/next-page');
  });

  test('The application should work when loading a page and clicking a link to target an element to scroll to', async function (assert) {
    config['routerScroll'] = {
      scrollElement: '#target-main',
    };

    await visit('/target');

    // testing specific
    let container = document.getElementById('ember-testing-container');
    assert.strictEqual(container.scrollTop, 0);

    document.getElementById('monster').scrollIntoView(false);
    assert.ok(container.scrollTop > 0);

    await click('a[href="/target-next-page"]');
    assert.strictEqual(currentURL(), '/target-next-page');
  });

  test('The application should work when just changing query params', async function (assert) {
    config['routerScroll'] = {
      scrollElement: '#ember-testing-container',
    };

    await visit('/');

    let container = document.getElementById('ember-testing-container');
    assert.strictEqual(container.scrollTop, 0);

    document.getElementById('monster').scrollIntoView(false);
    assert.ok(container.scrollTop > 0);

    await click('#change-size');
    assert.ok(container.scrollTop > 0);
  });
});
