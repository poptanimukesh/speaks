'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:studentteam:find');

const db = require('../../db2/index');
const helper = require('../helper');

var StudentTeam = db.StudentTeam;
var Student = db.Student;

var StudentTeamFindModel = function() {

}

StudentTeamFindModel.prototype.findAllBy = function(data) {
  var deferred = Q.defer();
  StudentTeam.findAll({
    where: data
  }).then(function(results) {
    var studentTeams = helper.maps.StudentTeams(results);
    deferred.resolve(studentTeams);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

StudentTeamFindModel.prototype.findAllByAggregated = function(data) {
  var deferred = Q.defer();
  StudentTeam.findAll({
    where: data,
    include: [{
      model: Student
    }]
  }).then(function(results) {
    var studentTeams = helper.maps.StudentTeams(results);
    var studentTeamsAggregated = helper.maps.StudentTeamsAggregated(studentTeams);
    deferred.resolve(studentTeamsAggregated);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

StudentTeamFindModel.prototype.findBy = function(data) {
  var deferred = Q.defer();
  StudentTeam.find({
    where: data
  }).then(function(result) {
    var studentTeam = helper.maps.StudentTeam(result);
    deferred.resolve(studentTeam);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

module.exports = StudentTeamFindModel;
