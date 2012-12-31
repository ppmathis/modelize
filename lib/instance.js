var Instance = function(definition, adapter) {
    var _this = this;

    /**
     * Object which stores all the property values from the model instance
     * @type {Object}
     */
    var properties = {};

    /**
     * Read in the definition
     * @constructor
     */
    definition.getProperties().forEach(function(property) {
        properties[property] = {
            value: null,
            initialized: null,
            dirty: false
        };
    });

    return {

        /**
         * Mixin property functions
         * @param instance Desired instance
         */
        mixinPropertyFunctions: function(instance) {
            var $this = this;
            for(var key in properties) {
                instance[key] = (function(key) {
                    return function(value) {
                        if(!value) return $this.getProperty(key);
                        $this.setProperty(key, value);
                    }
                })(key);
            }
        },

        /**
         * Mixin adapter functions (save, delete)
         * @param instance Desired instance
         */
        mixinAdapterFunctions: function(instance) {
            var $this = this;
            instance.dbUUID = null;
            instance.save = (function() {
                return function(cb) {
                    $this.checkRequiredProperties();
                    var updatedProps = $this.getUpdatedProperties();

                    if(!instance.dbUUID) {
                        instance.dbUUID = adapter.insert(instance, updatedProps, function(err) {
                            if(cb && cb.constructor == Function) cb(err);
                        });
                    } else {
                        adapter.update(instance.dbUUID, updatedProps, function(err) {
                            if(cb && cb.constructor == Function) cb(err);
                        });
                    }
                };
            })();
            instance.remove = (function() {
                return function(cb) {
                    adapter.remove(instance.dbUUID, function(err) {
                        if(cb && cb.constructor == Function) cb(err);
                        instance.dbUUID = null;
                    });
                }
            })();
        },

        /**
         * Get updated properties (dirty flag)
         * @return {Object}
         */
        getUpdatedProperties: function() {
            var updatedProps = {};
            for(var key in properties) {
                if(properties[key].dirty) {
                    updatedProps[key] = properties[key].value;
                    properties[key].dirty = false;
                }
            }
            return updatedProps;
        },

        /**
         * Assign data to the model instance with validation
         * @param data Data to assign
         */
        assignData: function(data) {
            for(var key in data) {
                this.setProperty(key, data[key]);
            }
        },

        /**
         * Sets the specified property and validates the new data
         * @param key Property name
         * @param value Data to validate and assign
         */
        setProperty: function(key, value) {
            // Check if property exists
            if(!properties.hasOwnProperty(key)) {
                throw new Error('Property does not exist: ' + key);
            }

            // Check if value is valid
            if(!definition.validateProperty(key, value)) {
                throw new Error('Tried to assign invalid data for property ' + key);
            }

            // Assign data
            properties[key].value = value;
            properties[key].dirty = true;
            if(!properties[key].initialized) properties[key].initialized = true;
        },

        /**
         * Gets the specified property or returns the default value when no data is available
         * @param key Property name
         * @return {*}
         */
        getProperty: function(key) {
            // Check if property exists
            if(!properties.hasOwnProperty(key)) {
                throw new Error('Property does not exist: ' + key);
            }

            // Check if property is initialized
            if(!properties[key].initialized) {
                return definition.getDefaultValue(key);
            } else {
                return properties[key].value;
            }
        },

        /**
         * Check if required properties exist
         */
        checkRequiredProperties: function() {
            var props = definition.getRequiredProperties();
            props.forEach(function(property) {
                if(!properties[property] || !properties[property].initialized) {
                    throw new Error('Missing required property: ' + property);
                }
            });
        }

    };
};

module.exports = Instance;