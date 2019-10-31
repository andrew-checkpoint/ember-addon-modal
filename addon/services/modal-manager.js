import Service from '@ember/service';

function ModalInstance(options, service) {
    this.name = options.name;
    this.options = options.options;

    this.close = () => {
        service.removeInstance(this);
    }
    return this;
}

export default Service.extend({
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
    removeInstance: function(modalInstance) {
        let instance = modalInstance;
        this.instances.removeObject(instance);
    },
    getInstance: function(name){
        return this.instances.findBy('name', name);
    }
});
