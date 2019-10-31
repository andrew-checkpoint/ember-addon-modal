import Mixin from '@ember/object/mixin';
import ModalAttrs from './modal-attrs';
import ModalInstance from '../components/modal-instance';

const hasDialogSupport = typeof (window.HTMLDialogElement && window.HTMLDialogElement.prototype.showModal) === 'function';
let mixin = null;

if(hasDialogSupport){
    mixin = Mixin.create(ModalAttrs, {
        tagName: 'dialog',
        classNames: ['cgg-dialog'],
        show: true,
        autoOpen: false,
        didInsertElement: function(){
            let sup = this._super(...arguments);
            if(this.autoOpen){
                this.openModal();
            }
            return sup;
        },
        openModal: function(){
            this.element.showModal();
        },
        closeModal: function(){
            this.element.close();
            this['on-close']();
        },
        click: function(evt){
            var rect = this.element.getBoundingClientRect();
            var isInDialog=(rect.top <= evt.clientY && evt.clientY <= rect.top + rect.height
              && rect.left <= evt.clientX && evt.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                this.closeModal();
            }
        }
    });
}else{
    mixin = Mixin.create(ModalAttrs, {
        tagName: 'cgg-dialog',
        classNames: ['cgg-dialog', 'cgg-dialog-fallback'],
        classNameBindings: ['show:is-open'],
        show: false,
        autoOpen: false,
        didInsertElement: function(){
            this._super(...arguments);
            if(this.autoOpen){
                this.openModal();
            }
            return;
        },
        openModal: function(){
            this.set('show', true);
        },
        closeModal: function(){
            this.set('show', false);
            this['on-close']();
        },
        click: function(evt) {

            let mI = this.nearestOfType(ModalInstance);
            let isInDialog = false;

            if (mI.isModal) {
                let rect = this.element.getBoundingClientRect();
                isInDialog =(rect.top <= evt.clientY && evt.clientY <= rect.top + rect.height
                  && rect.left <= evt.clientX && evt.clientX <= rect.left + rect.width);
            } else {
                isInDialog = this.element.contains(evt.target) && this.element !== evt.target;
            }
            
            if (!isInDialog) {
                this.closeModal();
            }
        }
    }); 
}

export default mixin;
