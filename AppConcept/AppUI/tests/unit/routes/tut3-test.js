import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | tut3', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:tut3');
    assert.ok(route);
  });
});
