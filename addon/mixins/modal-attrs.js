import Mixin from '@ember/object/mixin';
import { defineProperty } from '@ember/object';
import { alias } from '@ember/object/computed';
import ModalContainer from '../components/modal-container';

export default Mixin.create({
    didReceiveAttrs() {
        this.modalOptions;

        let inModal = !!this.nearestOfType(ModalContainer);

        if (inModal && this.attrs.modalOptions && typeof this.attrs.modalOptions === 'object') {
            let keys = Object.keys(this.attrs.modalOptions.value);
            for (var i = 0; i < keys.length; i++) {
                keys[i]
                defineProperty(this, keys[i], alias(`modalOptions.${keys[i]}`));
            }
        }

        this._super(...arguments);
    }
});