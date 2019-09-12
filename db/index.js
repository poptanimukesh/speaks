'use strict';

var QueryManager = require('./queryManager')
var connection = require('./connection');

var DBManager = function() {
  this._pspQueryManager = new QueryManager(connection["pharmdscholarlyproject"]);
  this._syllabusQueryManager = new QueryManager(connection["syllabus"]);
}

DBManager.prototype.queryManagerForType = function(type) {
  return new QueryManager(connection[type]);
}

DBManager.prototype.pspQueryManager = function() {
  return this._pspQueryManager;
}

DBManager.prototype.syllabusQueryManager = function() {
  return this._syllabusQueryManager;
}

module.exports = DBManager;
