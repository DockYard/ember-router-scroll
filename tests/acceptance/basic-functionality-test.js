import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { visit, click, currentURL } from '@ember/test-helpers'

module('Acceptance | basic functionality', function (hooks) {
  setupApplicationTest(hooks)

  test('The application should work when loading a page and clicking a link', async function (assert) {
    await visit('/')

    await click('a[href="/next-page"]')

    assert.equal(currentURL(), '/next-page')
  })
})
