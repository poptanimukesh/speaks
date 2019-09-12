'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:project:update');

const db = require('../../db2/index');
const helper = require('../helper');

const ProjectFindModel = require('./find');
const projectFindModel = new ProjectFindModel();

var Project = db.Project;

var ProjectUpdateModel = function() {

}

ProjectUpdateModel.prototype.updateBy = function(where, data) {
  var deferred = Q.defer();
  Project.update(data, {
    where: where
  }).then(function(results) {
    if (results[0] == 1) {
      return projectFindModel.findBy(where);
    } else {
      debug('Could not update Project');
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

module.exports = ProjectUpdateModel;
