// Implements the facade pattern to facilitate switching log engine at a later point.
var init = function(logEngine) {
	switch (logEngine) {
		case 'bunyan':
			var bunyan = require('./bunyan');
			exports.info = bunyan.info.bind(bunyan);
			exports.error = bunyan.error.bind(bunyan);
			break;
		default:
			throw 'Invalid logEngine ' + logEngine + '. Must be one of: bunyan';
	}
}

exports.init = init;
