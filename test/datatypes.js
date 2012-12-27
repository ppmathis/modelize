var vows = require('vows'),
    assert = require('assert'),
    datatypes = require('../lib/datatypes');

function assertTrue() {
    return function(topic) {
        assert.equal(topic, true);
    };
}

function assertFalse() {
    return function(topic) {
        assert.equal(topic, false);
    };
}

function validateData(datas, expect) {
    if(datas && datas.constructor != Array) datas = [datas];

    var test = {
        topic: function(type) {
            var isValid = true;

            for(var key in datas) {
                if(!type.isValid(datas[key])) {
                    isValid = false;
                    break;
                }
            }

            return isValid;
        }
    };

    if(!expect) {
        test['results in false'] = assertFalse();
    } else {
        test['results in true'] = assertTrue();
    }

    return test;
}

vows.describe('Data types').addBatch({
    'creating a valid data type': {
        topic: function() { return datatypes.isValidType('string'); },
        'results in true': assertTrue()
    },
    'creating an invalid data type': {
        topic: function() { return datatypes.isValidType('invalid'); },
        'results in false': assertFalse()
    },
    'validating a string containing a': {
        topic: datatypes.getType('string'),

        'string': validateData('Hello World', true),

        'number': validateData([42, 42.24], false),
        'array': validateData([[]], false),
        'object': validateData({}, false),
        'function': validateData(function() {}, false)
    },
    'validating a number containing a': {
        topic: datatypes.getType('number'),

        'integer': validateData(42, true),
        'float': validateData(42.24, true),

        'string': validateData('Hello World', false),
        'array': validateData([['string']], false),
        'object': validateData({}, false),
        'function': validateData(function() {}, false)
    },
    'validating a array containing a': {
        topic: datatypes.getType('array'),

        'array': validateData([[42, 'string']], true),

        'number': validateData([42, 42.24], false),
        'string': validateData('Hello World', false),
        'object': validateData({}, false),
        'function': validateData(function() {}, false)
    },
    'validating a object containing a': {
        topic: datatypes.getType('object'),

        'object': validateData({}, true),

        'number': validateData([42, 42.24], false),
        'string': validateData('Hello World', false),
        'array': validateData([[42, 'string']], false),
        'function': validateData(function() {}, false)
    }
}).export(module);