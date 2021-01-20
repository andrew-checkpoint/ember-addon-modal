import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

import {
    CLOSE_REASON_BACKGROUND,
    CLOSE_REASON_ESCAPE,
    CLOSE_REASON_SERVICE,
} from '../enum';

let modalUUID = 0;
function ModalInstance(options, service) {
    this.name = options.name;
    this.options = options.options;
    this.uuid = modalUUID++;

    this.closeable = true;

    let doReject = null;
    let doResolve = null;
    this.promise = new Promise((resolve, reject) => {
        doResolve = resolve;
        doReject = reject;
    });
    this.closeListeners = [];
    this.addCloseListener = (fn) => {
        this.closeListeners.pushObject(fn);
    }

    this.removeCloseListener = (fn) => {
        this.closeListeners.removeObject(fn);
    }

    this.willClose = (success, data, reason) => {
        if (!this.closeable) {
            return Promise.reject(false);
        }
        if (this.closeListeners.length) {
            return Promise.allSettled(this.closeListeners.map((c) => c(success, data, reason))).then((results) => {
                let success = results.filter((r) => r.status !== 'fulfilled' || r.value === false).length === 0;
                if (success) {
                    return Promise.resolve(true);
                }
                return Promise.reject(false);
            })
        }
        return Promise.resolve(true);
    }

    this.didClose = (success, data) => {
        if (success) {
            doResolve(data);
        } else {
            doReject(data);
        }
    }

    this.close = (success = true, data = null, reason = CLOSE_REASON_SERVICE) => {
        service.removeInstance(this, success, data, reason);
    }
    return this;
}

export default Service.extend({

    @tracked
    instances: null,
    init: function() {
        this.instances=[];
        return this._super(...arguments);
    },
    addInstance: function(name, args){
        let instance = new ModalInstance({
            name: name,
            options: args
        }, this);
        this.instances.pushObject(instance);
        return instance;
    },
    removeInstance: function(modalInstance, success = true, data = null, reason = null) {
        let instance = modalInstance;
        if (modalInstance.willClose) {
            return modalInstance.willClose(success, data, reason).then(() => {
                this.instances.removeObject(instance);
                instance.didClose(success, data)
            });
        }
        this.instances.removeObject(instance);
        instance.didClose(success, data)
        return null;
    },
    getInstance: function(name){
        return this.instances.findBy('uuid', name) || this.instances.findBy('name', name);
    }
});
