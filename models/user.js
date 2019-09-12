var debug = require('debug')('app:models:user');
var verbose = require('debug')('verbose/app:models:user');
var Q = require('q');
var bcrypt = require('bcrypt');
var DBManager = require('../db/index');
var ProxyModel = require('../models/proxy');
var format = require('string-format');

var dbManager = new DBManager();
var proxyModel = new ProxyModel();

const saltRounds = 10;

var UserModel = function() {
  this.pspQueryManager = dbManager.pspQueryManager();
  this.syllabusQueryManager = dbManager.syllabusQueryManager();
};

UserModel.prototype.createPassword = function(password) {
  var deferred = Q.defer();
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      verbose('ERROR: createPassword');
      debug(err);
      deferred.reject(err);
    } else {
      deferred.resolve(hash);
    }
  });
  return deferred.promise;
};

UserModel.prototype.insert = function(data, callback) {
  verbose('insert');
  var that = this;
  debug(data);
  that.insertHelper(data).then(function(results) {
    verbose('insert ... then');
    callback(undefined, results);
  }).catch(function(err) {
    verbose('ERROR: insert ... error');
    callback(err, undefined);
  });
};

UserModel.prototype.insertHelper = function(data) {
  verbose('insert helper');
  var that = this;
  var deferred = Q.defer();
  var queryT = 'INSERT INTO `user` (`UserID`, `Password`, `Role`) VALUES ("{}", "{}", "{}")';
  that.createPassword(data.password).then(function(hash) {
    var query = format(queryT, data.username, hash, data.role);
    that.pspQueryManager.query(query, function(err, results, fields) {
      if (err) {
        verbose('ERROR: insertHelper/db insert ... error');
        debug(err);
        deferred.reject(err);
      } else {
        verbose('insertHelper ... done');
        deferred.resolve(results[0]);
      }
    });
  }).catch(function(err) {
    verbose('ERROR: insertHelper/hash');
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

UserModel.prototype.authenticate = function(data, callback) {
  verbose('authenticate');
  var that = this;
  that.authenticateHelper(data).then(function(results) {
    verbose('authenticate ... then');
    callback(undefined, results);
  }).catch(function(err) {
    verbose('ERROR: authenticate ... error');
    callback(err, undefined);
  });
};

UserModel.prototype.authenticateHelper = function(data) {
  verbose('authenticate helper ...');
  var that = this;
  var deferred = Q.defer();
  var queryT = 'SELECT * FROM `user` WHERE UserID = "{}"';
  var query = format(queryT, data.username);
  that.pspQueryManager.query(query, function(err, results, fields) {
    if (err) {
      verbose('ERROR: authenticateHelper ... error');
      debug(err);
      deferred.reject(err);
    } else {
      verbose('authenticateHelper ... then');
      if (results[0] == undefined) {
        deferred.resolve({
          authenticated: false
        });
      } else {
        bcrypt.compare(data.password, results[0].Password, function(err, result) {
          if (result == false) {
            deferred.resolve({
              authenticated: false
            });
          } else {
            deferred.resolve({
              authenticated: true,
              username: results[0].UserID,
              role: results[0].Role,
            });
          }
        });
      }
    }
  });
  return deferred.promise;
};

module.exports = UserModel;
