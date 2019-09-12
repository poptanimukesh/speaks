var debug = require('debug')('app:models:api:project:index');
var verbose = require('debug')('verbose/app:models:api:project:index');
var Q = require('q');
var format = require('string-format');
var Cryptr = require('cryptr');
var DBManager = require('../../../db/index');

var cryptokey = require('../../../cryptokey.json');
var cryptr = new Cryptr(cryptokey.secret);

var dbManager = new DBManager();

var ApiProjectModel = function() {
  this.pspQueryManager = dbManager.pspQueryManager();
  this.syllabusQueryManager = dbManager.syllabusQueryManager();
};



ApiProjectModel.prototype.getProjectDetails = function(proxyId, callback) {
    var role = proxyId.split(':')[0];
    var projectId = proxyId.split(':')[1];

    // TODO: Need to mock properly. Currently returning objects.
    var mockErr = false;

    var resultErr = {
        status: 500
    };
    var err = mockErr;

    var result = mockResults[projectId];

    // TODO: Replace mocking
    if (result == undefined) {
        callback({
            status: 404,
            message: 'Invalid project id'
        }, undefined);
    } else {
        callback(undefined, result);
    }
};

ApiProjectModel.prototype.createAll = function(data, callback) {
    // TODO: Need to mock properly. Currently returning objects.
    var that = this;
    var mockErr = false;

    var resultErr = {
        status: 500,
        message: 'Create project failed'
    };
    var err = mockErr;

    var createProjectPromise = this.createProject(data);
    createProjectPromise.then(function(result) {
        verbose('createProject ... then');
        verbose(that.result);
        // this.pspQueryManager.end();
        that.result.proxyId = createProxyIds(that.result.projectId);
        callback(undefined, that.result);
    }).catch(function(err) {
        verbose('ERROR: createProject ...');
        debug(err);
        // this.pspQueryManager.end();
        callback(err, undefined);
    });
};

var createProxyIdForRole = function(role, projectId) {
    return cryptr.encrypt(role + ':' + projectId);
};

var createProxyIds = function(projectId) {
    return {
        admin: createProxyIdForRole('admin', projectId),
        mentor: createProxyIdForRole('mentor', projectId),
        student: createProxyIdForRole('student', projectId)
    }
};

ApiProjectModel.prototype.createProject = function(data) {
    var deferred = Q.defer();
    var that = this;
    that.result = {
        team: {},
        project: {},
        proposal: {}
    };

    that.insertStudents(data)
    .then(function(results) {
        verbose('insert students ... then');

        return that.insertStudentTeam(data);
    }).then(function(results) {
        verbose('insert student team ... then');

        verbose('teamId: ' + that.teamId);
        return that.insertMentors(data);
    }).then(function(results) {
        verbose('insert mentors ... then');

        return that.insertInitialDetails(data);
    }).then(function(results) {
        verbose('insert initial details ... then');

        return that.insertProject(data);
    }).then(function(results) {
        verbose('insert project ... then');

        return that.insertProjectMentor(that.result);
    }).then(function(results) {
        verbose('insert project lecturer ... then');

        deferred.resolve(results);
    }).catch(function(err) {
        verbose('ERROR: insert students chain ...');
        debug(err);
        deferred.reject(err);
    });

    return deferred.promise;
};

ApiProjectModel.prototype.insertStudents = function(data) {
    var that = this;
    verbose('insert students ...');
    var students = data.team.members;
    verbose(students);
    var deferred = Q.defer();
    var studentPromises = [];
    for (var i in students) {
        studentPromises.push(this.insertStudent(students[i]));
    }
    that.result.students = [];
    Q.all(studentPromises).then(function(results) {
        verbose('insert students ... done');
        that.result.team = data.team;
        deferred.resolve(results);
    }).catch(function(err) {
        debug(err);
        deferred.reject(err);
    });
    return deferred.promise;
};

ApiProjectModel.prototype.insertStudent = function(student) {
    var that = this;
    verbose('insert student ...');
    var deferred = Q.defer();
    var query = 'INSERT INTO `student` (`Email`, `FirstName`, `LastName`, `Active`, `Timestamp`) VALUES ("{email}", "{firstName}", "{lastName}", true, now());';
    this.pspQueryManager.query(format(query, student), function(err, results, fields) {
        if (err) {
            debug(err);
            deferred.reject(err);
        } else {
            verbose('insert student ... done');
            verbose(results[0]);
            student.studentId = results.insertId;
            that.result.students.push(student);
            deferred.resolve(results);
        }
    });
    return deferred.promise;
};

ApiProjectModel.prototype.insertStudentTeam = function(data) {
    var that = this;
    verbose('insert student team ...');
    var deferred = Q.defer();
    var members = data.team.members;
    that.insertStudentTeamAutoId(members[0]).then(function(results) {
        verbose('insert student team auto id ... then');
        if (data.team.members.length > 1) {
            return that.insertStudentTeamWithId({
                teamId: that.result.team.teamId,
                members: members.slice(1)
            });
        } else {
            verbose('insert student team with id ... then');
            deferred.resolve(results);
        }
    }).then(function(results) {
        verbose('insert student team with id ... then');
        deferred.resolve(results);
    }).catch(function(err) {
        verbose('ERROR: insert student team auto/with id ...');
        debug(err);
        deferred.reject(err);
    })
    return deferred.promise;
};

ApiProjectModel.prototype.insertStudentTeamAutoId = function(data) {
    var that = this;
    verbose('insert student team auto id ...');
    var deferred = Q.defer();
    var queryT = 'INSERT INTO `student_team` (`StudentID`) VALUES ';
    var valueT = '("{}")';
    var query = queryT + format(valueT, data.studentId);
    this.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            verbose('ERROR: insert student team auto id ...');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('insert student team auto id ... done');

            that.result.team.teamId = results.insertId;
            deferred.resolve(results);
        }
    });
    return deferred.promise;
}

ApiProjectModel.prototype.insertStudentTeamWithId = function(data) {
    var that = this;
    verbose('insert student team with id ...');

    var deferred = Q.defer();
    var queryT = 'INSERT INTO `student_team` (`TeamID`, `StudentID`) VALUES ';
    var valueT = '("{}", "{}")';
    var values = [];
    for (var i in data.members) {
        values.push(format(valueT, data.teamId, data.members[i].studentId));
    }
    var query = queryT + values;
    this.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            verbose('ERROR: insert student team with id ...');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('insert student team with id ... done');

            deferred.resolve(results);
        }
    });
    return deferred.promise;
}

ApiProjectModel.prototype.insertMentors = function(data) {
    var that = this;
    verbose('insert mentors ...');
    var mentors = data.mentors.members;
    verbose(mentors);
    var deferred = Q.defer();
    var mentorPromises = [];
    for (var i in mentors) {
      if (data.mentors2.operation == "none") {
        mentorPromises.push(this.selectMentor(data.fetchedMentor));
      } else if (data.mentors2.operation == "update") {
        mentorPromises.push(this.updateMentor(mentors[i], data.mentors2.updates));
      } else {
        mentorPromises.push(this.insertMentor(mentors[i]));
      }
    }
    that.result.mentors = [];
    Q.all(mentorPromises).then(function(results) {
        verbose('insert mentors ... done');
        deferred.resolve(results);
    }).catch(function(err) {
        debug(err);
        deferred.reject(err);
    });
    return deferred.promise;
};

ApiProjectModel.prototype.selectMentor = function(mentor) {
  verbose('select mentor');
  var that = this;
  var deferred = Q.defer();
  var queryT = 'SELECT `LecturerID`, `Email`, `FirstName`, `LastName`, `Phone`, `Title`, `Institution`, `Department`, `Status` FROM `lecturers` WHERE `Email` = "{}"';
  var query = format(queryT, mentor.email);
  this.syllabusQueryManager.query(query, function(err, results, fields) {
    if (err) {
      verbose('ERROR: select mentor ... error');
      debug(err);
      deferred.reject(err);
    } else {
      verbose('select mentor ... done');
      debug(results[0]);
      mentor.mentorId = results[0].LecturerID;
      that.result.mentors.push(mentor);
      deferred.resolve(results);
    }
  });
  return deferred.promise;
}

ApiProjectModel.prototype.updateMentor = function(mentor, keys) {
  verbose('update mentor');
  var that = this;
  var deferred = Q.defer();
  var queryT = 'UPDATE `lecturers` SET {} WHERE `Email` = "{}"';
  var itemT = '`{}` = "{}"';
  var items = [];
  var columnMap = {
    firstName: 'FirstName',
    lastName: 'LastName',
    email: 'Email',
    phoneNumber: 'Phone',
    jobTitle: 'Title',
    workplace: 'Institution'
  };
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    items.push(format(itemT, columnMap[key], mentor[key]));
  }
  var query = format(queryT, items.join(', '), mentor.email);
  that.syllabusQueryManager.query(query, function(err, results, fields) {
    if (err) {
      verbose('ERROR: updateMentor ... error');
      debug(err);
      deferred.reject(err);
    } else {
      verbose('updateMentor ... done');
      that.selectMentor(mentor).then(function(results) {
        deferred.resolve(results);
      }).catch(function(err) {
        verbose('ERROR: updateMentor/selectMentor ... error');
        debug(err);
        deferred.reject(err);
      });
    }
  });
  return deferred.promise;
}

ApiProjectModel.prototype.insertMentor = function(mentor) {
    var that = this;
    verbose('insert mentor ...');
    var deferred = Q.defer();
    var queryT = 'INSERT INTO `lecturers` (`Email`, `FirstName`, `LastName`, `Phone`, `Title`, `Institution`, `Department`, `Status`) VALUES ';
    var valueT = '("{}", "{}", "{}", "{}", "{}", "{}", null, "Sponsor")';
    var query = queryT + format(valueT, mentor.email, mentor.firstName, mentor.lastName, mentor.phoneNumber, mentor.jobTitle, mentor.workplace);
    this.syllabusQueryManager.query(query, function(err, results, fields) {
        if (err) {
            verbose('ERROR: insert mentor ... error');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('insert mentor ... done');

            mentor.mentorId = results.insertId;
            that.result.mentors.push(mentor);
            deferred.resolve(results);
        }
    });
    return deferred.promise;
};

ApiProjectModel.prototype.insertProjectMentor = function(data) {
  var that = this;
  verbose('insert project mentor ..');
  var deferred = Q.defer();
  var queryT = 'INSERT INTO `project_lecturer` (`ProjectID`, `LecturerID`) VALUES ({}, {})';
  var query = format(queryT, data.projectId, data.mentors[0].mentorId);
  this.pspQueryManager.query(query, function(err, results, fields) {
    if (err) {
      verbose('ERROR: insert project mentor ... error');
      debug(err);
      deferred.reject(err);
    } else {
      verbose('insert project mentor .. done');
      deferred.resolve(results);
    }
  });
  return deferred.promise;
}

ApiProjectModel.prototype.insertInitialDetails = function(data) {
    var deferred = Q.defer();
    var that = this;

    that.insertInitialProjectDetails(data)
    .then(function(results) {
        verbose('insert initial project details ... then');
        return that.insertAdditionalProjectDetailsTitleDescription2(data);
    }).then(function(results) {
        verbose('insert additional project details ... then');
        deferred.resolve(results);
    }).catch(function(err) {
        verbose('ERROR: insert project details ... err');
        deferred.reject(err);
    });

    return deferred.promise;
}

ApiProjectModel.prototype.insertInitialProjectDetails = function(data) {
    var that = this;
    verbose('insert initial project details ...');
    var deferred = Q.defer();
    var queryT = 'INSERT INTO `details` (`DataKey`, `DataValue`, `Timestamp`) VALUES ("project_init", "", now())';
    var query = format(queryT, data.title, data.description);
    this.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            debug(err);
            deferred.reject(err);
        } else {
            verbose('insert initial project details ... done');

            that.result.project.detailsId = results.insertId;
            deferred.resolve(results);
        }
    });
    return deferred.promise;
};

ApiProjectModel.prototype.insertAdditionalProjectDetails = function(data) {
    var that = this;
    verbose('insert additional project details ...');
    var deferred = Q.defer();
    var queryT = 'INSERT INTO `details` (`DetailsID`, `DataKey`, `DataValue`, `Timestamp`) VALUES {}';
    var valueT = '("{}", "{}", "{}", now())';
    var values = [];
    values.push(format(valueT, parseInt(that.result.project.detailsId), "title", data.title));
    values.push(format(valueT, parseInt(that.result.project.detailsId), "description", data.description));
    var query = format(queryT, values.join(","));
    that.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            debug(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;
}

ApiProjectModel.prototype.insertAdditionalProjectDetailsTitleDescription2 = function(data) {
  var that = this;
  verbose('insert additional project details 2 ...');
  var deferred = Q.defer();
  var promises = [];
  promises.push(that.insertAdditionalProjectDetailsItem2({
    detailsId: parseInt(that.result.project.detailsId),
    key: "title",
    value: data.title
  }));
  promises.push(that.insertAdditionalProjectDetailsItem2({
    detailsId: parseInt(that.result.project.detailsId),
    key: "description",
    value: data.description
  }));
  Q.all(promises).then(function(results) {
      deferred.resolve(results);
  }).catch(function(err) {
      debug(err);
      deferred.reject(err);
  });
  return deferred.promise;
}

ApiProjectModel.prototype.insertAdditionalProjectDetailsItem2 = function(data) {
  var that = this;
  verbose('insert additional project details 2 ...');
  var deferred = Q.defer();
  var query = 'INSERT INTO `details` (`DetailsID`, `DataKey`, `DataValue`, `Timestamp`) VALUES (?, ?, ?, now())';
  that.pspQueryManager.query(query, [data.detailsId, data.key, data.value], function(err, results, fields) {
    if (err) {
      debug(err);
      deferred.reject(err);
    } else {
      deferred.resolve(results);
    }
  });
  return deferred.promise;
}

ApiProjectModel.prototype.insertInitialProposalDetails = function(data) {
    var that = this;
    verbose('insert initial proposal details ...');
    var deferred = Q.defer();
    var query = 'INSERT INTO `details` (`DataKey`, `DataValue`) VALUES ("proposal_init", "");';
    this.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            debug(err);
            deferred.reject(err);
        } else {
            verbose('insert initial proposal details ... done');

            that.result.proposal.detailsId = results.insertId;
            deferred.resolve(results);
        }
    });
    return deferred.promise;
};

ApiProjectModel.prototype.insertProject = function(data) {
    var that = this;
    verbose('insert project ...');
    var deferred = Q.defer();
    var query = 'INSERT INTO `project` (`TeamID`, `MentorID`, `DetailsID`, `Timestamp`) VALUES ("{}", "{}", "{}", now());';
    query = format(query, that.result.team.teamId, that.result.mentors[0].mentorId, that.result.project.detailsId);
    this.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            verbose('insert project ... err');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('insert project ... done');
            verbose(results[0]);
            that.result.projectId = results.insertId;
            deferred.resolve(results);
        }
    });
    return deferred.promise;
};

module.exports = ApiProjectModel;
