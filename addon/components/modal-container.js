import Component from '@ember/component';
import layout from '../templates/components/modal-container';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
    layout,
    tagName: 'modal-container',
    modalManager: service(),
    modalInstances: alias('modalManager.instances'),
    actions: {
        modalClosed: function(modalInstance){
            this.modalManager.removeInstance(modalInstance);
        }
    }
});
