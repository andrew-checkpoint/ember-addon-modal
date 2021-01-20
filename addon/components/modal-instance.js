import Component from '@ember/component';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import Overlay from '../mixins/dialog';
import layout from '../templates/components/modal-instance';


export default Component.extend({
    tagName: '',
    layout,

    modalName: null,
    uuid: null,

    isModal: computed('modalName', function() {
        let owner = getOwner(this);
        let f = owner.factoryFor('component:'+this.modalName);
        if (f.class.PrototypeMixin && f.class.PrototypeMixin.mixins) {
            return f.class.PrototypeMixin.mixins.includes(Overlay);
        } else {
            return false;
        }
    }),

    options:  null,
    'on-close': () => {},

}).reopenClass({
    positionalParams: ['modalName', 'options', 'uuid'],
});
