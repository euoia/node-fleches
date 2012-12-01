// Hides the actual logging package behind a consistent interface so that it is
// easy to switch logging package if necessary.
// 
// All other libraries that require logging must log using this interface.
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
