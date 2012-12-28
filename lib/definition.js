var DataTypes = require('./datatypes');

/**
 * Stores and manages the model definition
 * @constructor
 */
var Definition = function() {
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
    function parsePropertyOptions(name, options) {
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
        createProperty: function(name, type, options) {
            // Validate data type
            if(!DataTypes.isValidType(type)) {
                throw new Error('Invalid property type: ' + type);
            }

            // Check if property already exists
            if(this.propertyExists(name)) {
                throw new Error('Property already exists: ' + name);
            }

            // Add property
            properties[name] = {
                type: DataTypes.getType(type)
            };
            parsePropertyOptions(name, options);
        },

        /**
         * Checks if a property exists
         * @param name Name of the property
         * @return {Boolean}
         */
        propertyExists: function(name) {
            return properties.hasOwnProperty(name);
        },

        /**
         * Checks if the specified data is valid for the property
         * @param name Property name
         * @param data Data to check
         * @return {Boolean}
         */
        validateProperty: function(name, data) {
            if(!this.propertyExists(name)) return false;
            if(!properties[name].type.isValid(data)) return false;
            return true;
        },

        /**
         * Gets the default value for a property or returns undefined
         * @param name Name of the property
         * @return {*}
         */
        getDefaultValue: function(name) {
            if(!this.propertyExists(name)) return undefined;
            if(!properties[name].defaultValue) return undefined;
            return properties[name].defaultValue;
        },

        /**
         * Returns the model properties
         * @return {Object}
         */
        getProperties: function() {
            var props = [];
            for(var key in properties) props.push(key);
            return props;
        },

        /**
         * Returns the required properties of a model
         * @return {Array}
         */
        getRequiredProperties: function() {
            return requiredProperties;
        }

    };
};

module.exports = Definition;