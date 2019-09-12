'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:lecturer:create');

const db = require('../../db2/index');
const helper = require('../helper');

var Lecturer = db.Lecturer;

var LecturerCreateModel = function() {

}

LecturerCreateModel.prototype.create = function(data) {
  var deferred = Q.defer();
  Lecturer.create(data)
  .then(function(result) {
    var lecturer = helper.maps.Lecturer(result);
    deferred.resolve(lecturer);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

module.exports = LecturerCreateModel;
