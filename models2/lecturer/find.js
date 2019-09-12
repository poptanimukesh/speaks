'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:lecturer:find');

const db = require('../../db2/index');
const helper = require('../helper');

var Lecturer = db.Lecturer;

var LecturerFindModel = function() {

}

LecturerFindModel.prototype.findBy = function(data) {
  var deferred = Q.defer();
  Lecturer.find({
    where: data
  }).then(function(result) {
    var lecturer = helper.maps.Lecturer(result);
    deferred.resolve(lecturer);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

LecturerFindModel.prototype.findAllBy = function(data) {
  var deferred = Q.defer();
  Lecturer.findAll({
    where: data
  }).then(function(results) {
    var lecturers = helper.maps.Lecturers(results);
    deferred.resolve(lecturers);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

module.exports = LecturerFindModel;
