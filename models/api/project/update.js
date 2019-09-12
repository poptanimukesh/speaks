var debug = require('debug')('app:models:api:project:update');
var verbose = require('debug')('verbose/app:models:api:project:update');
var Q = require('q');
var DBManager = require('../../../db/index');
var format = require('string-format');

var dbManager = new DBManager();

var ApiProjectUpdateModel = function() {
  this.pspQueryManager = dbManager.pspQueryManager();
  this.syllabusQueryManager = dbManager.syllabusQueryManager();
}

ApiProjectUpdateModel.prototype.update = function(data, callback) {
    var that = this;
    that.projectId = data.projectId;
    verbose('Doing foor projectId: ' + that.projectId);
    that.getDetailsId(data).then(function(results) {
        verbose('get details id ... then');
        return that.updateDetails(data);
    }).then(function(results) {
        verbose("update details ... then");
        callback(undefined, results);
    }).catch(function(err) {
        verbose("ERROR: update details ... then error");
        debug(err);
        callback(err, undefined);
    });
}

ApiProjectUpdateModel.prototype.getDetailsId = function(data) {
    verbose('get details id ...');
    var that = this;
    var deferred = Q.defer();
    var queryT = 'SELECT `DetailsID` FROM `project` WHERE `ProjectID` = {}';
    var query = format(queryT, parseInt(that.projectId));
    that.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            verbose('ERROR: get details id ... error');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('get details id ... done');
            that.detailsId = results[0].DetailsID;
            deferred.resolve(results);
        }
    })
    return deferred.promise;
}

ApiProjectUpdateModel.prototype.updateDetails = function(data) {
    verbose('update details ...');
    var that = this;
    var deferred = Q.defer();
    var queryT = 'INSERT INTO `details` VALUES {} ON DUPLICATE KEY UPDATE `DataValue` = VALUES(`DataValue`);'
    var valueT = '("{}", "{}", "{}", now())';
    var values = [];
    for (var key in data.details) {
        values.push(format(valueT, parseInt(that.detailsId), key, data.details[key]));
    }
    var query = format(queryT, values.join(","));
    verbose(query);
    that.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            verbose('update details ... error');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('update details ... done');

            deferred.resolve(results);
        }
    });

    return deferred.promise;
}

ApiProjectUpdateModel.prototype.delete = function(data, callback) {
    var that = this;
    that.projectId = data.projectId;
    verbose('Delete project: ' + that.projectId);
    that.deleteHelper(data)
    .then(function(results) {
        verbose("delete project ... then");
        callback(undefined, results);
    }).catch(function(err) {
        verbose("ERROR: delete project ... then error");
        debug(err);
        callback(err, undefined);
    });
}

ApiProjectUpdateModel.prototype.deleteHelper = function(data) {
    var that = this;
    verbose('delete helper');
    var deferred = Q.defer();
    var queryT = 'UPDATE `project` SET `Active` = false WHERE `ProjectID` = {}'
    var query = format(queryT, that.projectId);
    that.pspQueryManager.query(query, function(err, results, fields) {
      if (err) {
          verbose('ERROR: delete helper ... error');
          debug(err);
          deferred.reject(err);
      } else {
          verbose('delete helper  ... done');
          deferred.resolve(results);
      }
    });
    return deferred.promise;
}

module.exports = ApiProjectUpdateModel;
