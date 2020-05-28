import Component from '@ember/component';
import layout from '../templates/components/dialog-wrapper';
import Overlay from '../mixins/dialog';

export default Component.extend(Overlay, {
    layout,
    autoOpen: true,
    'on-close': () => {},
});
