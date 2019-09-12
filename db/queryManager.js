'use strict';

var mysql = require('mysql');

var QueryManager = function(connection) {
  this.connection = mysql.createConnection(connection);
}

QueryManager.prototype.connect = function() {
}

QueryManager.prototype.query = function(query, arg1, arg2) {
  if (arg2 != undefined && arg2 != null) {
    this.connection.query(query, arg1, function (error, results, fields) {
      arg2(error, results, fields);
    });
  } else {
    this.connection.query(query, function (error, results, fields) {
      arg1(error, results, fields);
    });
  }
}

QueryManager.prototype.end = function() {
}

module.exports = QueryManager;
