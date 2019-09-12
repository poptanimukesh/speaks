'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:email:find');

const db = require('../../db2/index');
const helper = require('../helper');


const EmailTemplate = db.EmailTemplate;

var EmailFindModel = function() {

}

EmailFindModel.prototype.findBy = function(data) {
  var deferred = Q.defer();
  EmailTemplate.find({
    where: data
  }).then(function(result) {
    var emailTemplate = helper.maps.EmailTemplate(result);
    deferred.resolve(emailTemplate);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

EmailFindModel.prototype.findAll = function(data) {
  var deferred = Q.defer();
  EmailTemplate.findAll({
    where: data
  }).then(function(results) {
    var emailTemplates = helper.maps.EmailTemplates(results);
    deferred.resolve(emailTemplates);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

module.exports = EmailFindModel;
