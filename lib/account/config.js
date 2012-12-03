var config = exports.config = require('./config.json'),
	log = require('log');

// Override the config.
exports.set = function(options) {
	for (var k in options) {
		log.info('Overriding config: ' + k + ' = ' + options[k]);
		config[k] = options[k];
	}
};

exports.get = function (k) {
	return config[k];
};
