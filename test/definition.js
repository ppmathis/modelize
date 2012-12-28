var vows = require('vows'),
    assert = require('assert'),
    Modelize = require('../lib');

vows.describe('Model definitions').addBatch({
    'declaring a model without specifying an adapter': {
        topic: function() {
            return new Modelize('TestModel', function() {
                this.property('field', 'string');
            });
        },

        'throws an error': function(Model) {
            assert.throws(function() {
                new Model();
            }, Error);
        }
    },
    'declaring a model with duplicate properties': {
        'throws an error': function() {
            assert.throws(function() {
                new Modelize('TestModel', function() {
                    this.property('field', 'string');
                    this.property('field', 'string');
                });
            }, Error);
        }
    },
    'declaring a model with an valid property option': {
        'does not throw an error': function() {
            assert.doesNotThrow(function() {
                new Modelize('TestModel', function() {
                    this.property('field', 'string', {defaultValue: 'test'});
                });
            }, Error);
        }
    },
    'declaring a model with an invalid property option': {
        'throws an error': function() {
            assert.throws(function() {
                new Modelize('TestModel', function() {
                    this.property('field', 'string', {invalidOption: true});
                });
            }, Error);
        }
    },
    'declaring a model property with an invalid default value': {
        'throws an error': function() {
            assert.throws(function() {
                new Modelize('TestModel', function() {
                    this.property('field', 'string', {defaultValue: 37});
                });
            }, Error);
        }
    }
}).export(module);