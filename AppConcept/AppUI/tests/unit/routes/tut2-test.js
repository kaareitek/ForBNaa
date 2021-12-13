import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | tut2', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:tut2');
    assert.ok(route);
  });
});
