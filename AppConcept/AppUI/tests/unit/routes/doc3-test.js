import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | doc3', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:doc3');
    assert.ok(route);
  });
});
