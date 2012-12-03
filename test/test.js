// ----------------------
// Firstly just perform a simple test of the features in Mocha.
require('./mocha');

// ----------------------
// Now test the application.
// ----------------------
require('log').init('bunyan');

// Test the account module.
require('./account');
