import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | applist', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:applist');
    assert.ok(route);
  });
});
