var debug = require('debug')('app:models:api:search');
var verbose = require('debug')('verbose/app:models:api:search');
var Q = require('q');
var DBManager = require('../../db/index');
var format = require('string-format');

var dbManager = new DBManager();

var SearchModel = function() {
    this.pspQueryManager = dbManager.pspQueryManager();
    this.syllabusQueryManager = dbManager.syllabusQueryManager();
}

SearchModel.prototype.findLecturer = function(data, callback) {
  verbose('findLecturer');
  var that = this;
  that.findLecturerHelper(data).then(function(results) {
    verbose('findLecturer ... then');
    callback(undefined, results);
  }).catch(function(err) {
    verbose('ERROR: findLecturer ... error');
    debug(err);
    callback(err, undefined);
  });
};

SearchModel.prototype.findLecturerHelper = function(data) {
  verbose('findLecturerHelper');
  var that = this;
  var deferred = Q.defer();
  var queryT = 'SELECT `LecturerID`, `Email`, `FirstName`, `LastName`, `Phone`, `Title`, `Institution`, `Department`, `Status` FROM `lecturers` WHERE `Email` = "{}"';
  var query = format(queryT, data.email);
  that.syllabusQueryManager.query(query, function(err, results, fields) {
    if (err) {
      verbose('ERROR: findLecturerHelper ... error');
      debug(err);
      deferred.reject(err);
    } else {
      verbose('findLecturerHelper ... done');
      deferred.resolve(results[0]);
    }
  });
  return deferred.promise;
};

module.exports = SearchModel;
