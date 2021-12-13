import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | advanced', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:advanced');
    assert.ok(route);
  });
});
