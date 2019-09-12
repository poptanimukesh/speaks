'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:user');
const bcrypt = require('bcrypt');

const db = require('../db2/index');
const dbName = 'User';

const saltRounds = 10;

var UserModel = function() {
  if (db[dbName] == undefined || db[dbName] == null) {
    throw new Error('DB not defined');
  }

  this.db = db[dbName];
}

/*
data.UserID
data.Password
*/
UserModel.prototype.authenticate = function(data) {
  var deferred = Q.defer();
  var UserID = null;
  var Role = null;

  this.db.find({
    where: {
      UserID: data.UserID
    }
  }).then(function(results) {
    UserID = results.dataValues.UserID;
    Role = results.dataValues.Role;
    return bcrypt.compare(data.Password, results.dataValues.Password);
  }).then(function(result) {
    if (result == false) {
      deferred.resolve({
        authenticated: false
      });
    } else {
      deferred.resolve({
        authenticated: true,
        UserID: UserID,
        Role: Role,
      });
    }
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });

  return deferred.promise;
}

UserModel.prototype.getAllReviewers = function(data) {
  var deferred = Q.defer();
  var UserID = null;
  var Role = null;

  this.db.findAll({
    where: {
      Role: 'Reviewer'
    }
  }).then(function(results) {
    var result = [];
    for (var i in results) {
      var detail = results[i];
      var item = {}
      item ["reviewer"] = detail.dataValues.UserID;
      result.push(item);
    }
    return result;
  }).then(function(result) {
      deferred.resolve({
        result
      });
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });

  return deferred.promise;
}

/*
data.UserID
data.Password
data.Role
*/
UserModel.prototype.insert = function(data) {
  var deferred = Q.defer();
  var that = this;

  this._createPassword(data.Password)
  .then(function(hash) {
    return that.db.create({
      UserID: data.UserID,
      Password: "" + hash,
      Role: data.Role
    });
  }).then(function(results) {
    deferred.resolve({
      UserID: results.dataValues.UserID,
      Role: results.dataValues.Role
    });
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });

  return deferred.promise;
}

UserModel.prototype._createPassword = function(password) {
  var deferred = Q.defer();

  bcrypt.hash(password, saltRounds)
  .then(function(hash) {
    deferred.resolve(hash);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });

  return deferred.promise;
}

module.exports = UserModel;
