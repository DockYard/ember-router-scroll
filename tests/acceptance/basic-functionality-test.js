import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | basic functionality');

test('The application should work when loading a page and clicking a link', function(assert) {
  visit('/');

  click('a[href="/next-page"]');

  andThen(() => {
    assert.equal(currentURL(), '/next-page');
  });
});
