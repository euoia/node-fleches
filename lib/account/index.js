// Interface to the account module.
// 
// Performs validation. Hands saving and retrieval off to the DB.
// 
// TODO: Split into separate files by logical functionality.
var bcrypt = require('bcrypt'),
  config = require('./config'),
  check = require('validator').check,
  log = require('log'),
  Validator = require('validator').Validator
  db = require('./db');

// ----------------------
// add
// 
// accountObj keys: username*, clearTextPassword*, email
// * Mandatory field.
// 
// Errors
// ------
// Any errors from validation or saving the account will be passed as the first
// argument to cb.
exports.add = function(accountObj, cb) {
  if (accountObj === undefined || cb === undefined) {
    throw new Error('Must specify accountObj and cb.');
  }

  // ----------------------
  // Validate mandatory fields.
  // TODO: More validation.
  try {
    check(accountObj.username, 'Invalid username').is(/^[a-z]+$/);
    check(accountObj.clearTextPassword, 'Password must be between 6 and 64 characters').len(6, 64);
  } catch (e) {
    log.info('Account has validation error: ' + e.message);
    return cb(e);
  }

  // ----------------------
  // Modify the account for insertion.
  // Salt and hash the password.
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(accountObj.clearTextPassword, salt);

  // ----------------------
  // Create and insert the account.
  var newAccountObj = {};
  newAccountObj.username = accountObj.username;
  newAccountObj.email = accountObj.email;
  newAccountObj.passwordSalt = salt;
  newAccountObj.passwordHash = hash;

  db.saveAccount(newAccountObj, cb);
};

exports.passwordMatches = function(accountObj, clearTextPassword) {
  if (accountObj === null || clearTextPassword === null) {
    throw new Error('Must specify accountObj and clearTextPassword');
  }

  var hash = bcrypt.hashSync(clearTextPassword, accountObj.passwordSalt);

  return (hash === accountObj.passwordHash);
};

// validateUpdate
// Desc: Validate the fields in accountObj for an update.
// Returns: undefined
// Sync? Yes
// Errors: Thrown
var validateUpdate = function(accountObj) {
	log.info('validating');
	check(accountObj.email, 'Invalid email').isEmail();
	log.info('all good');
};

// Validates and saves accountObj.
exports.update = function(accountObj, cb) {
  try {
		validateUpdate(accountObj);
  } catch (e) {
    log.info('Whilst updating, account has validation error: ' + e.message);
    return cb(e);
  }
	
	return db.updateAccount(accountObj, cb);
};

// ----------------------
// Proxy for sub-modules.
exports.initConn = db.initConn;
exports.get = db.getAccount;

exports.setConfig = config.set;
exports.getConfig = config.get;
