'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:student:find');

const db = require('../../db2/index');
const helper = require('../helper');

var Student = db.Student;

var StudentFindModel = function() {

}

StudentFindModel.prototype.findAllBy = function(data) {
  var deferred = Q.defer();
  Student.findAll({
    where: data
  }).then(function(results) {
    var students = helper.maps.Students(results);
    deferred.resolve(students);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

StudentFindModel.prototype.findBy = function(data) {
  var deferred = Q.defer();
  Student.find({
    where: data
  }).then(function(result) {
    var student = helper.maps.Student(result);
    deferred.resolve(student);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

module.exports = StudentFindModel;
