'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:projectlecturer:helper');

const db = require('../../db2/index');
const helper = require('../helper');

const LecturerFindModel = require('../lecturer/find');
const lecturerFindModel = new LecturerFindModel();

var ProjectLecturerHelperModel = function() {
}

ProjectLecturerHelperModel.prototype.projectExpandLecturers = function(project) {
  var deferred = Q.defer();
  lecturerFindModel.findAllBy({
    LecturerID: project.Lecturers
  }).then(function(result) {
    project.Lecturers = result;
    deferred.resolve(project);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  })
  return deferred.promise;
}

ProjectLecturerHelperModel.prototype.projectsExpandLecturers = function(projects) {
  var promises = [];
  for (var i in projects) {
    var project = projects[i];
    promises.push(this.projectExpandLecturers(project));
  }
  return Q.all(promises);
}

module.exports = ProjectLecturerHelperModel;
