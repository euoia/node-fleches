// Abstract interface for the database connection.
// 
// Validation is not performed at this layer. This is simply for saving and
// retrieving data.
// 
// The purpose of separating this component from the account component is to
// reduce coupling between the model and the underlying data storage.
var log = require('log'),
  _ = require('underscore'),
  config = require('./config');

// ----------------------
// Module variables.
// Store a reference to nano once we have the database connection string.
var nano = null;

// Store the database once connected.
var db = null;

// ----------------------
// Module methods.
var use = function(cb) {
    nano.db.list(function(err, body) {
      if (err) {
        log.error('Error listing databases.');
        return cb(err);
      }

      if (_.contains(body, config.get('dbName')) == 0) {
        log.info('Account database \'' + config.get('dbName') + '\' does not exist; creating it.');
        create(function(err) {
          if (err) {
            return cb(err);
          }

          db = nano.use(config.get('dbName'));
          return cb(null);
        });
      } else {
        log.info('Database already exists, using it.');
        db = nano.use(config.get('dbName'));
        return cb(null);
      }
    });
  };

// Create the database.
var create = function(cb) {
    nano.db.create(config.get('dbName'), function(err, body) {
      if (err) {
        log.error('Error creating database.');
        return cb(err);
      }

      log.info('Created database.');
      return cb();
    });
  };

// Drop the database.
var destroy = function(cb) {
    log.info('Destroying database \'' + config.get('dbName') + '\'.');

    nano.db.destroy(config.get('dbName'), function(err, body) {
      if (err) {
        log.error('Error destroying database: ' + err);
        return cb(err);
      }

      log.info('Destroyed database.');
      return cb();
    });
  };

// ----------------------
// Exported methods.
// Initialize the database connection.
// dbConnString - like, "http://localhost:5984"
var initConn = exports.initConn = function(dbConnString, cb) {
    if (config.get('dbLogging')) {
      var dbLogFunc = function(id, args) {
          console.log(id, args)
        };
    } else {
      var dbLogFunc = null;
    }

    nano = require('nano')({
      "url": dbConnString,
      "log": dbLogFunc
    });

    // TODO: Clean up the duplicated use() call, possibly using async.
    if (config.get('destroyDB')) {
      destroy(function(err) {
        if (err) {
          return cb(err);
        }

        use(cb);
      });
    } else {
      use(cb);
    }

  };

// saveAccount
// accountObj : username, passwordHash, passwordSalt, email
// 
// Errors
// ------
// If there is an error cb will be called with the error object.
exports.saveAccount = function(accountObj, cb) {
  log.info('Saving account ' + accountObj.username);

  db.insert(accountObj, accountObj.username, function(err, body, header) {
    if (err) {
      log.info('saveAccount error: ' + err.message);
      return cb(err);
    }

    log.info('Account inserted.');
    return cb(null);
  });
};


// getAccount
// Retrieve an account by the username.
// 
exports.getAccount = function(username, cb) {
  log.info('Getting account ' + username);

  db.get(username, function(err, body) {
    if (err) {
      log.info('getAccount error: ' + err.message);
      return cb(err);
    }

    return cb(null, body);
  });
};

// Update the account.
exports.updateAccount = function(newAccountObj, cb) {
  log.info('Updating account ' + newAccountObj.username);

  // TODO: Find out what update and inplace mean. They were taken from the nano
  // README.md file.
  db.insert(newAccountObj, newAccountObj.username, function(err, body, header) {
		if (err) {
			return cb(err);
		}
		
		return cb(null);
  });
};
