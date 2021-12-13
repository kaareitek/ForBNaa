import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | myapps', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:myapps');
    assert.ok(route);
  });
});
