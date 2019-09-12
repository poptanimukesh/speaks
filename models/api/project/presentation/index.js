var debug = require('debug')('app:models:api:project:presentation:index');
var verbose = require('debug')('verbose/app:models:api:project:presentation:index');
var Q = require('q');
var DBManager = require('../../../../db/index');
var format = require('string-format');

var ProxyModel = require('../../../proxy');
var proxyModel = new ProxyModel();

var dbManager = new DBManager();

var ApiProjectPresentationModel = function() {
    this.pspQueryManager = dbManager.pspQueryManager();
    this.syllabusQueryManager = dbManager.syllabusQueryManager();
}

var columns = [
  { name: "PresentationID", title: "ID", visible: false, breakpoints: "xs"},
  { name: "Date", title: "Date", type: "date", formatString: "YYYY-MM-DD"},
  { name: "Meeting", title: "Meeting" },
  { name: "Location", title: "Location", breakpoints: "xs sm md lg"},
  { name: "Title", title: "Title", breakpoints: "xs" },
  { name: "Authors", title: "Authors", breakpoints: "xs sm md lg" }
];

ApiProjectPresentationModel.prototype.getColumns = function(data, callback) {
  callback(undefined, columns);
};

ApiProjectPresentationModel.prototype.getAll = function(data, callback) {
  var that = this;
  data.projectId = proxyModel.getProjectId(data.proxyId);
  that.getAllHelper(data).then(function(results) {
    verbose('get all ... then');
    verbose(results);
    callback(undefined, results);
  }).catch(function(err) {
    verbose('ERROR: get all ... error');
    verbose(err);
    callback(err, undefined);
  });
}

ApiProjectPresentationModel.prototype.getAllHelper = function(data) {
  var that = this;
  verbose('get all helper');
  var deferred = Q.defer();
  var queryT = 'SELECT * FROM `presentation` WHERE `ProjectID` = {}';
  var query = format(queryT, data.projectId);
  that.pspQueryManager.query(query, function(err, results, fields) {
    if (err) {
      verbose('ERROR: get all helper ... error');
      debug(err);
      deferred.reject(err);
    } else {
      verbose('get all helper ... done');
      deferred.resolve(results);
    }
  });

  return deferred.promise;
}

ApiProjectPresentationModel.prototype.create = function(data, callback) {
  var that = this;
  verbose('create');
  data.projectId = proxyModel.getProjectId(data.proxyId);
  that.createHelper(data).then(function(results) {
    verbose('create ... then');
    callback(undefined, results);
  }).catch(function(err) {
    verbose('ERROR: create ... error');
    verbose(err);
    callback(err, undefined);
  });
}

ApiProjectPresentationModel.prototype.createHelper = function(data) {
  var that = this;
  verbose('create helper');
  var deferred = Q.defer();
  var queryT = 'INSERT INTO `presentation` (`ProjectID`, `Meeting`, `Location`, `Date`, `Title`, `Authors`, `Timestamp`) VALUES ({}, "{}", "{}", "{}", "{}", "{}", now())';
  var query = format(queryT, data.projectId, data.meeting, data.location, data.date, data.title, data.authors);
  this.pspQueryManager.query(query, function(err, results, fields) {
    if (err) {
      verbose('ERROR: create helper ... error');
      debug(err);
      deferred.reject(err);
    } else {
      verbose('create helper ... then');
      verbose(results);
      deferred.resolve(results[0]);
    }
  });
  return deferred.promise;
}

ApiProjectPresentationModel.prototype.delete = function(data, callback) {
  var that = this;
  verbose('delete');
  that.deleteHelper(data).then(function(results) {
    verbose('delete ... then');
    callback(undefined, results);
  }).catch(function(err) {
    verbose('ERROR: delete ... error');
    verbose(err);
    callback(err, undefined);
  });
}

ApiProjectPresentationModel.prototype.deleteHelper = function(data) {
  var that = this;
  verbose('deleteHelper');
  var deferred = Q.defer();
  var queryT = 'DELETE FROM `presentation` WHERE `PresentationID` = {}';
  var query = format(queryT, data.presentationId);
  this.pspQueryManager.query(query, function(err, results, fields) {
    if (err) {
      verbose('ERROR: deleteHelper ... error');
      debug(err);
      deferred.reject(err);
    } else {
      verbose('deleteHelper ... then');
      deferred.resolve(results);
    }
  });
  return deferred.promise;
}

module.exports = ApiProjectPresentationModel;
