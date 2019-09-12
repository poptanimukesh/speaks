'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:projectlecturer:create');

const db = require('../../db2/index');
const helper = require('../helper');

var ProjectLecturer = db.ProjectLecturer;

var ProjectLecturerCreateModel = function() {

}

ProjectLecturerCreateModel.prototype.create = function(data) {
  var deferred = Q.defer();
  ProjectLecturer.create(data)
  .then(function(result) {
    var projectLecturer = helper.maps.ProjectLecturer(result);
    deferred.resolve(projectLecturer);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

module.exports = ProjectLecturerCreateModel;
