'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:details:find');

const db = require('../../db2/index');
const helper = require('../helper');

var Details = db.Details;

var DetailsFindModel = function() {

}

DetailsFindModel.prototype.findAllBy = function(data) {
  var deferred = Q.defer();
  Details.findAll({
    where: data
  }).then(function(result) {
    var details = helper.maps.DetailsAggregatedAsObject(result);
    deferred.resolve(details);
  }).catch(function(err) {
    debug(err);
    deferred.reject(err);
  });
  return deferred.promise;
}

module.exports = DetailsFindModel;
