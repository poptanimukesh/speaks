'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:projectlecturer:find');

const db = require('../../db2/index');
const helper = require('../helper');

var ProjectLecturer = db.ProjectLecturer;

var ProjectLecturerFindModel = function() {

}

ProjectLecturerFindModel.prototype.findAllBy = function(data) {
  var deferred = Q.defer();
  ProjectLecturer.findAll({
    where: data
  }).then(function(results) {
    var projectLecturers = helper.maps.ProjectLecturers(results);
    deferred.resolve(projectLecturers);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

module.exports = ProjectLecturerFindModel;
