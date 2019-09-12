'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:lecturer:update');

const db = require('../../db2/index');
const helper = require('../helper');

const LecturerFindModel = require('./find');
const lecturerFindModel = new LecturerFindModel();

var Lecturer = db.Lecturer;

var LecturerUpdateModel = function() {

}

LecturerUpdateModel.prototype.updateBy = function(where, data) {
  var deferred = Q.defer();
  Lecturer.update(data, {
    where: where
  }).then(function(results) {
    if (results[0] == 1) {
      return lecturerFindModel.findBy(where);
    } else {
      debug('Could not update Lecturer');
      deferred.reject(results[0]);
    }
  }).then(function(result) {
    deferred.resolve(result);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

module.exports = LecturerUpdateModel;
