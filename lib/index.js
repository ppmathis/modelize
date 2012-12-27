var Property = require('./property');

/**
 * Modelize - Simple ORM library in JavaScript
 * @param {Function} modelDefinition Function which defines the model
 * @constructor
 */
var Modelize = function(modelDefinition) {
    var _this = this,
        property = new Property();

    var ModelConstructor = {
        property: function() {
            property.create.apply(_this, arguments);
        }
    };

    modelDefinition.call(ModelConstructor);
    return function ModelInstanceConstructor(data) {
        // Assign property functions
        var properties = property.getProperties();
        for(var key in properties) {
            this[key] = (function(key) {
                return function(value) {
                    if(!value) return property.get(key);
                    property.set(key, value);
                };
            })(key);
        }

        // Assign the data to the properties
        for(var key in data) {
            property.set(key, data[key]);
        }

        // Check if all the required fields are defined
        // @todo Remove this function call and put it inside the adapter
        property.checkRequiredProperties();
    };
};
module.exports = Modelize;