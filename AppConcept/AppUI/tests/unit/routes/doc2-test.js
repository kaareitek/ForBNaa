import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | doc2', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:doc2');
    assert.ok(route);
  });
});
