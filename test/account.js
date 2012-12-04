var account = require('account'),
  assert = require('assert'),
  config = require('../config.json');

// ----------------------
// Testing the accounts module.
describe('Account', function() {
  var badAccount = {
    username: 'has spaces',
    clearTextPassword: 'pass123'
  };

  var goodAccount = {
    username: 'nospaces',
    clearTextPassword: 'pass123'
  };

  before(function(done) {
    account.setConfig({
      "dbName": "account-test",
      "destroyDB": true,
      "dbLogging": true
    });

    account.initConn(config.dbConnString, done);
  });

  describe('#add()', function() {
    it('username with spaces should fail to add an account', function(done) {
      account.add(badAccount, function(err) {
        assert.ok(err, "there must be an error");
        assert.ok(err.message, "a message is given");
        done();
      });

    });

    it('should add an account', function(done) {
      account.add(goodAccount, done);
    });

    it('should fail when the same account is added again', function(done) {
      account.add(goodAccount, function(err) {
        assert.ok(err, "there must be an error");
        assert.ok(err.message, "a message is given");
        done();
      });
    });
  });

  var retAcc;

  describe('#get()', function() {
    it('should be able to get the added account', function(done) {
      account.get(goodAccount.username, function(err, acc) {
        retAcc = acc;
        done();
      });
    });
  });

  describe('#passwordMatches()', function() {
    it('should return false when the wrong password is given', function() {
      var result = account.passwordMatches(retAcc, 'bad_pass');
      assert.equal(result, false, 'Wrong password was allowed.');
    });

    it('should return true when the correct password is given', function() {
      var result = account.passwordMatches(retAcc, goodAccount.clearTextPassword);
      assert.equal(result, true, 'Correct password was not allowed.');
    });
  });

  describe('#updateAccount()', function() {
    it('should not return an error with a valid email', function(done) {
      retAcc.email = 'euoia@aioue.net';
      account.update(retAcc, function(err, updatedAcc) {
        assert.equal(err, undefined, 'failed to update account');
        retAcc = updatedAcc;
        done();
      });
    });

    it('should return an error with an invalid email', function(done) {
      retAcc.email = 'euoia   @aioue.net';
      account.update(retAcc, function(err, updatedAcc) {
        assert.ok(err, 'there must be an error');
        assert.ok(err.message, 'a message is given');
        assert.equal(updatedAcc, undefined, 'account must not be updated');
        done();
      });
    });

  });

}); // Account module.

// ----------------------
// Test the account routes.
