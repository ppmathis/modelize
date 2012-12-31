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

    function ModelInstanceConstructor(data) {
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
    }

    if(modelDefinition) modelDefinition.call(ModelConstructor);
    return {
        create: function(data) {
            return new ModelInstanceConstructor(data);
        },
        find: function(query, cb) {
            var $this = this;
            adapter.find($this, query, function(err, data) {
                if(cb && cb.constructor == Function) cb(err, data);
            });
        },
        findOne: function(query, cb) {
            var $this = this;
            adapter.findOne($this, query, function(err, data) {
                if(cb && cb.constructor == Function) cb(err, data);
            });
        }
    };
};

module.exports = Modelize;