import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click, currentURL, triggerEvent } from '@ember/test-helpers';

module('Acceptance | basic functionality', function(hooks) {
  setupApplicationTest(hooks);

  test('The application should work when loading a page and clicking a link', async function(assert) {
    await visit('/');
    assert.equal(window.scrollY, 0);

    await document.getElementById('monster').scrollIntoView(false);
    await triggerEvent(window, 'scroll');

    await click('a[href="/next-page"]');

    assert.equal(currentURL(), '/next-page');
  });

  test('The application should work when loading a page and clicking a link to target an element to scroll to', async function(assert) {
    await visit('/target');
    assert.equal(window.scrollY, 0);

    await document.getElementById('monster').scrollIntoView(false);

    await click('a[href="/target-next-page"]');
    assert.equal(window.scrollY, 0);

    assert.equal(currentURL(), '/target-next-page');
  });
});
