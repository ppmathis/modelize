var Definition = require('./definition'),
    Adapters = require('./adapters'),
    Instance = require('./instance');

/**
 * Modelize - Simple ORM library in JavaScript
 * @param {Function} modelDefinition Function which defines the model
 * @constructor
 */
var Modelize = function(name, modelDefinition) {
    var _this = this,
        definition = new Definition();
        adapter = null;

    var ModelConstructor = {
        adapter: function(name) {
            adapter = Adapters.getAdapter(name);
        },
        property: function() {
            definition.createProperty.apply(definition, arguments);
        }
    };

    if(modelDefinition) modelDefinition.call(ModelConstructor);
    return function ModelInstanceConstructor(data) {
        // Check if adapter exists
        if(!adapter) {
            throw new Error('No adapter was configured for model.');
        }

        // Create new model instance and mixin property functions
        var instance = new Instance(definition, adapter);
        instance.mixinPropertyFunctions(this);
        instance.mixinAdapterFunctions(this);
        instance.assignData(data);
        this.instance = instance;
    };
};

module.exports = Modelize;