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

    return {

        /**
         * Inserts a model instance into the store
         * @param data Model instance to store
         * @param cb Callback for error handling
         */
        insert: function(data, cb) {
            // Generate UUIDs and regenerate it if it already exists
            var uuid = generateUUID();
            while(memoryStore.hasOwnProperty(uuid)) uuid = generateUUID();

            // Assign model into store
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
            cb(null);
        }

    }
};

module.exports = MemoryAdapter;