var MemoryAdapter = function() {

    /**
     * Generates a random UUID
     * @param a Placeholder
     * @return {String}
     * @license Taken from: https://gist.github.com/982883 - Thanks!
     */
    function generateUUID(a) {
        return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, generateUUID)
    }

    var memoryStore = {};
    var instanceStore = new (require('../instanceStore.js'))();

    return {

        /**
         * Inserts a model instance into the store
         * @param data Model instance to store
         * @param cb Callback for error handling
         */
        insert: function(instance, data, cb) {
            // Generate UUIDs and regenerate it if it already exists
            var uuid = generateUUID();
            while(memoryStore.hasOwnProperty(uuid)) uuid = generateUUID();

            // Assign model into store
            instanceStore.add(uuid, instance);
            memoryStore[uuid] = data;
            cb(null);
            return uuid;
        },

        /**
         * Updates a model instance in the store
         * @param uuid UUID of the model instance
         * @param data Updated model instance to store
         * @param cb Callback for error handling
         */
        update: function(uuid, data, cb) {
            // Check if specified UUID is valid
            if(!memoryStore.hasOwnProperty(uuid)) {
                cb(new Error('Specified UUID not found in store.'));
                return;
            }

            // Assign data
            for(var key in data) memoryStore[uuid][key] = data[key];
            cb(null);
        },

        /**
         * Removes a model instance from the store
         * @param uuid UUID of the model instance
         * @param cb Callback for error handling
         */
        remove: function(uuid, cb) {
            // Check if specified UUID is valid
            if(!memoryStore.hasOwnProperty(uuid)) {
                cb(new Error('Specified UUID not found in store.'));
                return;
            }

            delete memoryStore[uuid];
            instanceStore.remove(uuid);
            cb(null);
        },

        /**
         * Finds multiple items that are matching the specified query parameters
         * @param model Model definition
         * @param query Query parameters
         * @param cb Callback
         * @param one If set to true, only one item will be fetched (for internal use / findOne)
         */
        find: function(model, query, cb, one) {
            var results = [];
            for(var uuid in memoryStore) {
                var modelData = memoryStore[uuid];
                var match = true;

                // Compare properties
                for(var key in query) {
                    if(query[key] != modelData[key]) { match = false; break; }
                }

                // No match? Continue with iterating
                // Otherwise proceed with creating/fetching an instance
                if(!match) continue;
                var instance = instanceStore.get(uuid);

                // Create a new instance or fetch an old one from the instance store
                if(instance === undefined) {
                    console.log(uuid + ': New instance created');
                    instance = model.create(modelData);
                    instanceStore.add(uuid, instance);
                    results.push(instance);
                } else {
                    console.log(uuid + ': Old instance fetched');
                    results.push(instance);
                }
                if(one) break;
            }

            cb(null, results);
        },

        /**
         * Finds a single item/instance with matches the specified query parameters
         * @param model Model definition
         * @param query Query parameters
         * @param cb Callback
         */
        findOne: function(model, query, cb) {
            this.find(model, query, function(err, data) {
                if(err) {
                    cb(err);
                } else if (data.length == 0) {
                    cb(null, undefined);
                } else {
                    cb(null, data[0]);
                }
            }, true);
        }

    }
};

module.exports = MemoryAdapter;