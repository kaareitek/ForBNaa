import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | comm1', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:comm1');
    assert.ok(route);
  });
});
