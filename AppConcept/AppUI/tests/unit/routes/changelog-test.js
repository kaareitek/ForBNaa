import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | changelog', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:changelog');
    assert.ok(route);
  });
});
