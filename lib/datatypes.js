var DataTypes = (function() {
    /**
     * A basic data type
     * @interface
     * @private
     */
    function DataType() {}
    DataType.prototype = {
        /**
         * Name of the data type
         * @type {String}
         */
        name: 'undefined',

        /**
         * Checks if the data is valid
         * @param data Data to check
         * @return {Boolean}
         */
        isValid: function(data) {
            return true;
        }
    };

    /**
     * String data type
     * @constructor
     * @implements DataType
     * @private
     */
    var TypeString = function() {};
    TypeString.prototype = Object.create(DataType);
    TypeString.prototype.name = 'string';
    TypeString.prototype.isValid = function(data) {
        return typeof(data) == 'string';
    };

    /**
     * Number data type
     * @constructor
     * @implements DataType
     * @private
     */
    var TypeNumber = function() {};
    TypeNumber.prototype = Object.create(DataType);
    TypeNumber.prototype.name = 'number';
    TypeNumber.prototype.isValid = function(data) {
        return typeof !isNaN(data) && isFinite(data);
    };

    /**
     * Array data type
     * @constructor
     * @implements DataType
     * @private
     */
    var TypeArray = function() {};
    TypeArray.prototype = Object.create(DataType);
    TypeArray.prototype.name = 'array';
    TypeArray.prototype.isValid = function(data) {
        return data && data.constructor == Array;
    };

    /**
     * Object data type
     * @constructor
     * @implements DataType
     * @private
     */
    var TypeObject = function() {};
    TypeObject.prototype = Object.create(DataType);
    TypeObject.prototype.name = 'object';
    TypeObject.prototype.isValid = function(data) {
        return data && data.constructor == Object;
    };

    /**
     * Object which contains all the valid property types
     * @type {Object}
     * @private
     */
    var types = {
        string: new TypeString(),
        number: new TypeNumber(),
        array: new TypeArray(),
        object: new TypeObject()
    };

    return {
        /**
         * Checks if the specified type is valid
         * @param {String} type Data type to check
         * @return {Boolean}
         */
        isValidType: function(type) {
            return types.hasOwnProperty(type);
        },

        getType: function(type) {
            // Check if type is valid
            if(!this.isValidType(type)) {
                throw new Error('Invalid data type: ' + type);
            }

            return types[type];
        }
    };
})();

module.exports = DataTypes;