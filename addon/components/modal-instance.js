import Component from '@ember/component';
import layout from '../templates/components/modal-instance';
import { computed } from '@ember/object';
import DialogMixin from '../mixins/dialog';
import { getOwner } from '@ember/application';


export default Component.extend({
    tagName: '',
    layout,

    modalName: null,
    isModal: computed('modalName', function() {
        let owner = getOwner(this);
        let f = owner.factoryFor('component:'+this.modalName);
        return f.class.PrototypeMixin.mixins.includes(DialogMixin);
    }),
    options:  null,
    'on-close': ()=>{},
}).reopenClass({
    positionalParams: ['modalName', 'options'],
});
