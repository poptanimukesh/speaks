'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:project:find');

const db = require('../../db2/index');
const helper = require('../helper');

const StudentTeamFindModel = require('../studentteam/find');
const ProjectLecturerHelperModel = require('../projectlecturer/helper');

const studentTeamFindModel = new StudentTeamFindModel();
const projectLecturerHelperModel = new ProjectLecturerHelperModel();

const Project = db.Project;
const StudentTeam = db.StudentTeam;
const Student = db.Student;
const Details = db.Details;
const ProjectLecturer = db.ProjectLecturer;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var ProjectFindModel = function() {

}

ProjectFindModel.prototype.findAllBy = function(data) {
  var deferred = Q.defer();
  Project.findAll({
    where: data
  }).then(function(results) {
    var projects = helper.maps.Projects(results);
    deferred.resolve(projects);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

ProjectFindModel.prototype.findBy = function(data) {
  var deferred = Q.defer();
  Project.find({
    where: data
  }).then(function(result) {
    var project = helper.maps.Project(result);
    deferred.resolve(project);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

ProjectFindModel.prototype.findByAggregated = function(data) {
  var deferred = Q.defer();
  var project = {};
  Project.find({
    where: data,
    include: [{
      model: StudentTeam,
      include: [{
        model: Student
      }]
    }, {
      model: Details
    }, {
      model: ProjectLecturer
    }]
  }).then(function(result) {
    project = helper.maps.ProjectAggregated(result);
    return projectLecturerHelperModel.projectExpandLecturers(project);
  }).then(function(result){
    deferred.resolve(result);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

ProjectFindModel.prototype.findAllByAggregated = function(data) {
  var deferred = Q.defer();
  var projects = [];
  Project.findAll({
    where: {
      Timestamp : {
        [Op.like]: '2019%'
      }
    },
    include: [{
      model: StudentTeam,
      include: [{
        model: Student
      }]
    }, {
      model: Details
    }, {
      model: ProjectLecturer
    }]
  }).then(function(results) {
    projects = helper.maps.ProjectsAggregated(results);
    return projectLecturerHelperModel.projectsExpandLecturers(projects);
  }).then(function(results) {
    deferred.resolve(results);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

module.exports = ProjectFindModel;
