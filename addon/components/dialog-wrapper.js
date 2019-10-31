import Component from '@ember/component';
import layout from '../templates/components/dialog-wrapper';
import DialogMixin from '../mixins/dialog';

export default Component.extend(DialogMixin, {
    layout,
    autoOpen: true,
    'on-close': ()=>{},
});
