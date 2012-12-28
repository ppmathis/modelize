var Adapters = (function() {
    /**
     * Object which contains all available adapters
     */
    var adapters = {
        memory: require('./adapters/memory')
    };

    return {
        getAdapter: function(name) {
            if(!adapters.hasOwnProperty((name))) {
                throw new Error('Invalid adapter: ' + name);
            }
            return new (adapters[name])();
        }
    }
})();

module.exports = Adapters;