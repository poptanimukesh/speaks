'use strict';

var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:api:project:index');

var ApiProjectModel = require('../../../models/api/project/index');
var ApiProjectGetModel = require('../../../models/api/project/get');
var ApiProjectUpdateModel = require('../../../models/api/project/update');

var ProxyModel = require('../../../models2/proxy');
var ProjectFindModel = require('../../../models2/project/find');
var ProjectUpdateModel = require('../../../models2/project/update');
var DetailsUpdateModel = require('../../../models2/details/update');
var LecturerFindModel = require('../../../models2/lecturer/find');
var LecturerCreateModel = require('../../../models2/lecturer/create');
var LecturerUpdateModel = require('../../../models2/lecturer/update');
var ProjectLecturerCreateModel = require('../../../models2/projectlecturer/create');
var LegacyProjectHelperModel = require('../../../models2/legacy/project');
var EmailUpdateModel = require('../../../models2/email/update');
var EmailFindModel = require('../../../models2/email/find');

var projectFindModel = new ProjectFindModel();
var projectUpdateModel = new ProjectUpdateModel();
var detailsUpdateModel = new DetailsUpdateModel();
var lecturerFindModel = new LecturerFindModel();
var lecturerCreateModel = new LecturerCreateModel();
var lecturerUpdateModel = new LecturerUpdateModel();
var projectLecturerCreateModel = new ProjectLecturerCreateModel();
var legacyProjectHelperModel = new LegacyProjectHelperModel();
var proxyModel = new ProxyModel();

var authorize = require('../../../middleware/authorize');

var Cryptr = require('cryptr');
var cryptokey = require('../../../cryptokey.json');
var cryptr = new Cryptr(cryptokey.secret);

var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;

router.get('/:proxyId', function(req, res) {
  var projectId = proxyModel.getProjectId(req.params['proxyId']);

  projectFindModel.findByAggregated({
    ProjectID: projectId
  }).then(function(result) {
    result = legacyProjectHelperModel.wrapProjectSync(result);
    result = legacyProjectHelperModel.legacyFormatProjectSync(result);
    res.json({
      status: 'success',
      message: 'Project fetched',
      data: result,
    });
  }).catch(function(err) {
    debug(err);
    res.json({
      status: 'error',
      message: 'Error in fetch project details',
      details: err
    });
  });
});

router.post('/:proxyId/addmentor', function(req, res) {
  var projectId = proxyModel.getProjectId(req.params['proxyId']);

  var data = {
    mentors: req.body.mentors,
    mentors2: req.body.mentors2,
    fetchedMentor: req.body.fetchedMentor,
  };

  console.log();console.log();console.log();console.log();console.log();
  console.log(data);
  console.log(data.mentors);
  console.log(data.mentors2);
  console.log(data.fetchedMentor);

  if (data.mentors2.operation == 'none') {
    projectLecturerCreateModel.create({
      ProjectID: projectId,
      LecturerID: data.fetchedMentor.lecturerId
    }).then(function(result) {
      res.json({
        status: 'success',
        message: 'Mentor added',
        data: result,
      });
    }).catch(function(err) {
      res.json({
        status: 'error',
        message: 'Error in adding mentor',
        details: err
      });
    });
  } else if (data.mentors2.operation == 'insert') {
    lecturerCreateModel.create({
      Email: data.mentors.members[0].email,
      FirstName: data.mentors.members[0].firstName,
      LastName: data.mentors.members[0].lastName,
      Title: data.mentors.members[0].jobTitle,
      Institution: data.mentors.members[0].workplace,
      Phone: data.mentors.members[0].phoneNumber
    }).then(function(result) {
      return projectLecturerCreateModel.create({
        ProjectID: projectId,
        LecturerID: result.LecturerID
      });
    }).then(function(result) {
      res.json({
        status: 'success',
        message: 'Mentor added',
        data: result,
      });
    }).catch(function(err) {
      res.json({
        status: 'error',
        message: 'Error in adding mentor',
        details: err
      });
    });
  } else if (data.mentors2.operation == 'update') {
    var columnMap = {
      firstName: 'FirstName',
      lastName: 'LastName',
      email: 'Email',
      phoneNumber: 'Phone',
      jobTitle: 'Title',
      workplace: 'Institution'
    };
    var values = {};
    for (var i in data.mentors2.updates) {
      var column = data.mentors2.updates[i];
      values[columnMap[column]] = data.mentors.members[0][column];
    }
    console.log(values);
    lecturerUpdateModel.updateBy({
      LecturerID: data.fetchedMentor.lecturerId
    }, values).then(function(result) {
      return projectLecturerCreateModel.create({
        ProjectID: projectId,
        LecturerID: data.fetchedMentor.lecturerId
      });
    }).then(function(result) {
      res.json({
        status: 'success',
        message: 'Mentor added',
        data: result,
      });
    }).catch(function(err) {
      res.json({
        status: 'error',
        message: 'Error in adding mentor',
        details: err
      });
    });
  } else {
    res.json({
      status: 'error',
      message: 'Invalid operation in adding mentor',
      details: err
    });
    return;
  }
});

router.post('/', function(req, res) {
  var apiProjectModel = new ApiProjectModel();

  //TODO: We might want to change keys while populating to create an abstraction
  var data = {
    title: req.body.title,
    team: req.body.team,
    mentors: req.body.mentors,
    mentors2: req.body.mentors2,
    fetchedMentor: req.body.fetchedMentor,
    description: req.body.description,
  };

  for (var i = 0; i < data.mentors.members.length; ++i) {
    var phoneNumber = phoneUtil.parseAndKeepRawInput(data.mentors.members[i].phoneNumber, 'US');
    data.mentors.members[i].phoneNumber = '+' + phoneUtil.formatOutOfCountryCallingNumber(phoneNumber, 'US');
  }

  apiProjectModel.createAll(data, function(err, result) {
    if (err) {
      // throw 'Error in creating project';
      res.json({
        status: 'error',
        message: 'Error in creating project',
        details: err
      });
    } else {
      res.json({
        status: 'success',
        message: 'Project created',
        data: result,
      });
    }
  });
});

router.put('/:proxyId/details', function(req, res) {
  var proxyId = req.params['proxyId'];
  var proxyIdDecrypt = cryptr.decrypt(proxyId);
  var role = proxyIdDecrypt.split(':')[0];
  var projectId = proxyIdDecrypt.split(':')[1];

  var details = req.body

  detailsUpdateModel.updateBy({
    ProjectID: projectId
  }, details).then(function(result) {
    res.json({
      status: 'success',
      message: 'Project details updated',
      data: result
    });
  }).catch(function(err) {
    res.json({
      status: 'error',
      message: 'Error in updating project details',
      details: err
    });
  });
});

router.delete('/:proxyId', authorize('Admin', '/admin/login'), function(req, res) {
  var proxyId = req.params['proxyId'];
  var proxyIdDecrypt = cryptr.decrypt(proxyId);
  var role = proxyIdDecrypt.split(':')[0];
  var projectId = proxyIdDecrypt.split(':')[1];

  var where = {
    ProjectID: projectId
  };

  projectFindModel.findBy(where)
  .then(function(project) {
    projectUpdateModel.updateBy(where, {
      Active: !project.Active
    }).then(function(result) {
      res.json({
        status: 'success',
        message: 'Project details updated',
        data: result
      });
    }).catch(function(err) {
      res.json({
        status: 'error',
        message: 'Error in updating project details',
        details: err
      });
    });
  }).catch(function(err) {
    res.json({
      status: 'error',
      message: 'Error in updating project details',
      details: err
    });
  });
});


router.post('/emailupdate', function(req, res) {
  var emailUpdateModel = new EmailUpdateModel();
  var emailFindModel = new EmailFindModel();

  //TODO: We might want to change keys while populating to create an abstraction
  var data = {
    EmailType: req.body.email_type,
    CCEmailId: req.body.cc_email_id,
    BCCEmailId: req.body.bcc_email_id,
    EmailSubject: req.body.email_subject,
    EmailBody: req.body.email_body
  };

  emailUpdateModel.updateBy({
      EmailType: req.body.email_type
    }, data).then(function(result) {
      console.log("res update :" + result);
    res.json({
      status: 'success',
      message: 'emailupdate details updated',
      data: result
    });
  }).catch(function(err) {
    res.json({
      status: 'error',
      message: 'Error in updating emailupdate details',
      details: err
    });
  });
  
});

module.exports = router;
