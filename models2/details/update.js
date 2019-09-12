'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:details:update');

const db = require('../../db2/index');
const helper = require('../helper');

const ProjectFindModel = require('../project/find');

const projectFindModel = new ProjectFindModel();

var Details = db.Details;

var DetailsUpdateModel = function () {

}

var createUpdateDataArray = function (detailsId, data) {
    var updateData = [];
    for (var i in Object.keys(data)) {
        var key = Object.keys(data)[i];
        var value = data[key];
        updateData.push({
            DetailsID: detailsId,
            DataKey: key,
            DataValue: value
        });
    }
    return updateData;
}

DetailsUpdateModel.prototype.updateBy = function (where, data) {
    var deferred = Q.defer();

    projectFindModel.findByAggregated({
        ProjectID: where.ProjectID
    }).then(function (result) {
        var updateData = createUpdateDataArray(result.DetailsID, data);
        Details.bulkCreate(updateData, {
            updateOnDuplicate: []
        }).then(function (results) {
            deferred.resolve(results);
        }).catch(function (err) {
            deferred.reject(err);
        });
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

module.exports = DetailsUpdateModel;