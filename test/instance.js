var vows = require('vows'),
    assert = require('assert'),
    Modelize = require('../lib');

vows.describe('Model instances').addBatch({
    'instantiating a model with a default value': {
        topic: function() {
            var Model = new Modelize('TestModel', function() {
                this.adapter('memory');
                this.property('field', 'string', {defaultValue: 'Default value'})
            })
            return Model.create();
        },

        'without setting the property': {
            topic: function(ModelInstance) { return ModelInstance.field(); },

            'returns the default value': function(topic) {
                assert.equal(topic, 'Default value');
            }
        },

        'with setting the property': {
            topic: function(ModelInstance) {
                ModelInstance.field('Custom value');
                return ModelInstance.field();
            },

            'returns the custom value': function(topic) {
                assert.equal(topic, 'Custom value');
            }
        }
    },
    'instantiating a model with a required field': {
        topic: function() {
            return new Modelize('TestModel', function() {
                this.adapter('memory');
                this.property('requiredField', 'string', {required: true});
            });
        },

        'does not throw an error': function(Model) {
            assert.doesNotThrow(function() {
                Model.create({
                    requiredField: 'test'
                }).save();
            }, Error);
        }
    },
    'instantiating a model with a missing required field': {
        topic: function() {
            return new Modelize('TestModel', function() {
                this.adapter('memory');
                this.property('requiredField', 'string', {required: true});
            });
        },

        'throws an error': function(Model) {
            assert.throws(function() {
                Model.create().save();
            }, Error);
        }
    },
    'changing a model property': {
        topic: function() {
            var Model = new Modelize('TestModel', function() {
                this.adapter('memory');
                this.property('changedField', 'string');
                this.property('unchangedField', 'string');
            });
            var ModelInstance = Model.create({
                changedField: 'Hello World',
                unchangedField: 'Goodbye World'
            });
            ModelInstance.save();
            return ModelInstance;
        },

        'should make it dirty': function(ModelInstance) {
            ModelInstance.changedField('Hello Earth');
            var props = ModelInstance.instance.getUpdatedProperties();
            assert.instanceOf(props, Object);
            assert.lengthOf(props, 1);
            assert.equal(props.changedField, 'Hello Earth');
        }
    }
}).export(module);