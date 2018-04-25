import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click, currentURL, triggerEvent } from '@ember/test-helpers';
import config from 'dummy/config/environment';

module('Acceptance | basic functionality', function(hooks) {
  setupApplicationTest(hooks);

  test('The application should work when loading a page and clicking a link', async function(assert) {
    await visit('/');

    await click('a[href="/next-page"]');

    assert.equal(currentURL(), '/next-page');
  });

  test('scott The application should work when loading a page and clicking a link', async function(assert) {
    let originalConfig = config.routerScroll;
    config['routerScroll'] = {
      targetElement: '#main'
    };

    await visit('/target');

    // TODO: add test.  We have a scrolling container in test land - need to figure this out
    // await document.getElementById('monster').scrollIntoView(false);
    // await triggerEvent('#main', 'scroll');

    await click('a[href="/target-next-page"]');

    assert.equal(currentURL(), '/target-next-page');

    config['routerScroll'] = originalConfig;
  });
});
