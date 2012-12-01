// Hides the actual logging package behind a consistent interface so that it is
// easy to switch logging package if necessary.
// 
// All other libraries that require logging must log using this interface.
var init = function(logEngine) {
	switch (logEngine) {
		case 'console':
			exports.info = console.log;
			exports.error = console.log;
			break;
		case 'bunyan':
			var bunyan = require('./bunyan');
			exports.info = bunyan.info.bind(bunyan);
			exports.error = bunyan.error.bind(bunyan);
			break;
		default:
			throw 'Invalid logEngine ' + logEngine + '. Must be one of: bunyan, console';
	}
	
			
		this.info('Logging initialized using ' + logEngine + '.');
}

exports.init = init;

// Default to console logging.
exports.info = console.log;
exports.error = console.log;
