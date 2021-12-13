import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | applist/myapp', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:applist/myapp');
    assert.ok(route);
  });
});
