import Mixin from '@ember/object/mixin';
import { bind } from '@ember/runloop';

import ModalAttrs from './modal-attrs';
import ModalInstance from '../components/modal-instance';
import options from '../index';

import {
    CLOSE_REASON_BACKGROUND,
    CLOSE_REASON_ESCAPE,
    CLOSE_REASON_SERVICE,
} from '../enum';

export const checkTargetAndElementCoords = ({ element, event }) => {
    const el = element?.getBoundingClientRect();
    const elTop = el?.top;
    const elLeft = el?.left;
    const elWidth = el?.width;
    const elHeight = el?.height;
    const posX = event?.clientX;
    const posY = event?.clientY;

    return (
        el
        && elTop <= posY
        && posY <= elTop + elHeight
        && elLeft <= posX
        && posX <= elLeft + elWidth
    );
};

export const Dialog = Mixin.create(ModalAttrs, {
    tagName: 'dialog',
    classNames: ['cgg-dialog'],

    show: true,
    autoOpen: false,
    isModalMixin: true,

    didInsertElement: function() {
        let sup = this._super(...arguments);

        if (this.autoOpen) {
            this.openModal();
        }

        return sup;
    },

    openModal: function() {
        this.element.showModal();
    },

    closeModal: function() {
        this.element.close();
        this['on-close']();
    },

    click: function(evt) {
        var isInDialog = checkTargetAndElementCoords({
            element: this.element,
            event: evt,
        });

        if (!isInDialog) {
            this.closeModal(CLOSE_REASON_BACKGROUND);
        }
    }
});

export const Modal = Mixin.create(ModalAttrs, {
    tagName: 'modal',
    classNames: ['cgg-modal'],
    classNameBindings: ['show:is-open'],

    show: false,
    autoOpen: false,
    isModalMixin: true,

    init() {
        this._super(...arguments);

        this.boundIsClickOutsideModal = bind(this, this.isClickOutsideModal);
        this.boundEscKeyClose = bind(this, this.escKeyClose);
    },

    didInsertElement() {
        this._super(...arguments);

        this.bindEvents();

        if (this.autoOpen) {
            this.openModal();
        }

        return;
    },

    willDestroyElement() {
        this.unbindEvents();
    },

    openModal: function() {
        this.set('show', true);
    },

    closeModal: function(reason) {
        this.set('show', false);
        this['on-close'](reason);
    },

    bindEvents() {
        window.addEventListener('click', this.boundIsClickOutsideModal, true);
        window.addEventListener('keydown', this.boundEscKeyClose, true);
    },

    unbindEvents() {
        window.removeEventListener('click', this.boundIsClickOutsideModal, true);
        window.removeEventListener('keydown', this.boundEscKeyClose, true);
    },

    isClickOutsideModal(evt) {
        const mI = this.nearestOfType(ModalInstance);
        let isInDialog = false;

        if (mI.isModal) {
            isInDialog = checkTargetAndElementCoords({
                element: this.element,
                event: evt,
            });
        } else {
            isInDialog = this.element?.contains(evt.target) || this.element === evt.target;
        }

        if (!isInDialog) {
            this.closeModal(CLOSE_REASON_BACKGROUND);
        }
    },

    escKeyClose(evt) {
        if (evt.key === 'Escape') {
            this.closeModal(CLOSE_REASON_ESCAPE);
        }
    },
});

const OverlayType = !options.disableDialogSupport && typeof (
    window.HTMLDialogElement
    && window.HTMLDialogElement.prototype.showModal
) === 'function' ? Dialog : Modal;

const Overlay = Mixin.create(OverlayType, {});

export default Overlay;
