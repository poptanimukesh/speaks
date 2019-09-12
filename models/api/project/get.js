var debug = require('debug')('app:models:api:project:getAll');
var verbose = require('debug')('verbose/app:models:api:project:getAll');
var Q = require('q');
var DBManager = require('../../../db/index');
var format = require('string-format');

var dbManager = new DBManager();

var ApiProjectGetModel = function() {
    this.pspQueryManager = dbManager.pspQueryManager();
    this.syllabusQueryManager = dbManager.syllabusQueryManager();
}

ApiProjectGetModel.prototype.getAll = function(data, callback) {
    verbose('get all ...');
    var that = this;
    that.projectId = data.projectId;

    that.result = {
        project: {},
        team: {},
        mentors: {},
        details: {},
    };
    that.temp = {};

    that.getAllHelper(data).then(function(results) {
        verbose('get all herlper ... then');
        callback(undefined, that.result);
    }).catch(function(err) {
        verbose('ERROR: get all helper ... error then');
        callback(err, undefined);
    });
}

ApiProjectGetModel.prototype.getAllHelper = function(data) {
    verbose('get all helper ...');
    var that = this;
    var deferred = Q.defer();
    that.getProject(data).then(function(results) {
        verbose('get project ... then');
        return that.getStudents(data);
    }).then(function(results) {
        verbose('get students ... then');
        return that.getMentors(data);
    }).then(function(results) {
        verbose('get mentors ... then');
        return that.getDetails(data);
    }).then(function(results) {
        verbose('get details ... then');
        deferred.resolve(results);
    }).catch(function(err) {
        verbose('ERROR: get all helper ... error');
        debug(err);
        deferred.reject(err);
    });
    return deferred.promise;
}

ApiProjectGetModel.prototype.getProject = function(data) {
    var that = this;
    verbose('get project ...');
    var deferred = Q.defer();
    var queryT = 'SELECT * FROM `project` WHERE `ProjectID` = "{}"';
    var query = format(queryT, parseInt(that.projectId));
    that.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            verbose('ERROR: get project ... error');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('get project ... done');
            that.result.project.active = results[0].Active;
            that.result.project.projectId = results[0].ProjectID;
            that.result.team.teamId = results[0].TeamID;
            that.result.project.detailsId = results[0].DetailsID;
            deferred.resolve(results);
        }
    })
    return deferred.promise;
}

ApiProjectGetModel.prototype.getStudents = function(data) {
    var that = this;
    verbose('get students ...');
    var deferred = Q.defer();
    var queryT = 'SELECT * FROM `student` WHERE `StudentID` IN (SELECT `StudentID` FROM `student_team` WHERE `TeamID` = {})';
    var query = format(queryT, parseInt(that.result.team.teamId));
    that.result.team.members = [];
    that.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            verbose('ERROR: get students ... error');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('get students ... done');

            for (var i in results) {
                that.result.team.members.push(results[i]);
            }
            deferred.resolve(results);
        }
    });
    return deferred.promise;
}

ApiProjectGetModel.prototype.getMentors = function(data) {
    var that = this;
    verbose('get mentors ...');
    var deferred = Q.defer();
    // BUG[MAJOR]: DON'T hardcode this
    var queryT = 'SELECT * FROM `syllabus`.`lecturers` WHERE `LecturerID` = (SELECT `MentorID` FROM `pharmdscholarlyproject`.`project` WHERE `ProjectID` = {});';
    var query = format(queryT, parseInt(that.projectId));
    that.result.mentors.members = [];
    that.syllabusQueryManager.query(query, function(err, results, fields) {
        if (err) {
            verbose('ERROR: get mentors ... error');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('get mentors ... done');

            for (var i in results) {
                that.result.mentors.members.push(results[i]);
            }
            deferred.resolve(results);
        }
    })
    return deferred.promise;
}

ApiProjectGetModel.prototype.getDetails = function(data) {
    var that = this;
    verbose('get details ...');
    var deferred = Q.defer();
    var queryT = 'SELECT * FROM `details` WHERE `DetailsID` = {}';
    var query = format(queryT, that.result.project.detailsId);
    that.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            verbose('ERROR: get details ... error');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('get details ... done');

            for (var i in results) {
                that.result.details[results[i].DataKey] = results[i].DataValue;
            }
            deferred.resolve(results);
        }
    });
    return deferred.promise;
}

module.exports = ApiProjectGetModel;
