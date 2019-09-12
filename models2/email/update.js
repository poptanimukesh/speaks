'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:email:update');

const db = require('../../db2/index');
const helper = require('../helper');

const EmailFindModel = require('./find');
const emailFindModel = new EmailFindModel();

var EmailTemplate = db.EmailTemplate;

var EmailUpdateModel = function() {

}

EmailUpdateModel.prototype.updateBy = function(where, data) {
  var deferred = Q.defer();
  EmailTemplate.update(data, {
    where: where
  }).then(function(results) {
    if (results[0] == 1) {
      return emailFindModel.findBy(where);
    } else {
      debug('Could not update EmailTemplate');
      deferred.reject(results[0]);
    }
  }).then(function(result) {
    deferred.resolve(result);
  }).catch(function(err) {
    debug(err);
    console.log("err" + err);
    deferred.reject(err);
  });
  return deferred.promise;
}

module.exports = EmailUpdateModel;
