var DataTypes = require('./datatypes');

/**
 * Stores and manages properties for a model
 * @constructor
 */
var Property = function() {
    /**
     * Stores all the defined properties
     * @type {Object}
     * @private
     */
    var properties = {};

    /**
     * Stores required properties
     * @type {Array}
     * @private
     */
    var requiredProperties = [];

    /**
     * Parses the property options and validates them
     * @param {String} name
     * @param {Object} options
     */
    function parseOptions(name, options) {
        for(var key in options) {
            var value = options[key];
            switch(key) {
                case 'defaultValue':
                    // Check if default value is valid
                    var type = properties[name].type;
                    if(!type.isValid(value)) {
                        throw new Error('Invalid default value for type ' + type.name + ': ' + value);
                    }

                    properties[name].defaultValue = value;
                    break;
                case 'required':
                    if(value) requiredProperties.push(name);
                    break;
                default:
                    throw new Error('Invalid property option: ' + key);
                    break;
            }
        }
    }

    return {
        /**
         * Creates a new property
         * @param {String} name Name of the new property
         * @param {String} type Valid data type for the property
         * @param {Object} options Optional property options
         */
        create: function(name, type, options) {
            // Validate data type
            if(!DataTypes.isValidType(type)) {
                throw new Error('Invalid property type: ' + type);
            }

            // Check if property already exists
            if(properties.hasOwnProperty(name)) {
                throw new Error('Property already exists: ' + name);
            }

            // Add property
            properties[name] = {
                type: DataTypes.getType(type),
                initialized: false,
                value: null
            };
            parseOptions(name, options);
        },

        /**
         * Checks if a property exists
         * @param name Name of the property
         * @return {Boolean}
         */
        exists: function(name) {
            return properties.hasOwnProperty(name);
        },

        /**
         * Checks if all the required properties are initialized
         */
        checkRequiredProperties: function() {
            for(var key in requiredProperties) {
                var property = requiredProperties[key];
                if(!properties[property].hasOwnProperty('initialized') || !properties[property].initialized) {
                    throw new Error('Required property not initialized: ' + property);
                }
            }
        },

        /**
         * Gets the value of a property
         * @param {String} name Name of the property
         * @return {*}
         */
        get: function(name) {
            // Check if property exists
            if(!this.exists(name)) {
                throw new Error('Property does not exist: ' + name);
            }

            // Check if property is initialized
            var property = properties[name];
            if(!property.hasOwnProperty('initialized') || !property.initialized) {
                // Check if property has a default value
                if(property.hasOwnProperty('defaultValue')) {
                    return property.defaultValue;
                } else {
                    return undefined;
                }
            } else {
                return property.value;
            }
        },

        /**
         * Sets the value of a property
         * @param {String} name Name of the property
         * @param {*} value Value to set
         */
        set: function(name, value) {
            // Check if property exists
            if(!this.exists(name)) {
                throw new Error('Property does not exist: ' + name);
            }

            // Check if data matches the specified property type
            if(!properties[name].type.isValid(value)) {
                throw new Error('Invalid data for property: ' + name);
            }

            properties[name].value = value;
            if(!properties[name].initialized) properties[name].initialized = true;
        },

        /**
         * Returns the properties object (read-only)
         * @return {Object}
         */
        getProperties: function() {
            return properties;
        }

    };
};

module.exports = Property;