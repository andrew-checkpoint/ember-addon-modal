import EmberObject from '@ember/object';
import DialogMixin from 'checkpoint-modal/mixins/dialog';
import { module, test } from 'qunit';

module('Unit | Mixin | dialog', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let DialogObject = EmberObject.extend(DialogMixin);
    let subject = DialogObject.create();
    assert.ok(subject);
  });
});
