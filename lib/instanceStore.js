var InstanceStore = function() {
    /**
     * Object which contains all active instances
     * @type {Object}
     */
    var instances = {};

    return {
        add: function(uuid, instance) {
            // Check if instance already exists
            if(instances.hasOwnProperty(uuid)) {
                throw new Error('Instance already exists for UUID: ' + uuid);
            }

            // Add instance into store
            instances[uuid] = instance;
        },

        get: function(uuid) {
            // Check if instance exists
            if(instances.hasOwnProperty(uuid)) {
                return instances[uuid];
            } else {
                return undefined;
            }
        },

        remove: function(uuid) {
            if(instances.hasOwnProperty(uuid)) delete instances[uuid];
        }
    };
};

module.exports = InstanceStore;