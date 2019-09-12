var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:admin:project:index');
var passport = require('passport');

var ApiAdminProjectModel = require('../../../models/api/admin/project/getAll');
var authorize = require('../../../middleware/authorize');

var Cryptr = require('cryptr');
var cryptr = new Cryptr(require('../../../cryptokey.json').secret);

var json2csv = require('json2csv');

router.get('/', authorize('Admin', '/admin/login'), function (req, res) {
  var apiAdminProjectModel = new ApiAdminProjectModel();

  apiAdminProjectModel.getAll({}, function(err, result) {
    if (err) {
      //BUG: Need to show 500 page
      res.json(err);
    } else {
      console.log("HELOOOOOO M HERE....................");
      console.log("len:" + result.projects.length);
      for(var i=0; i<result.projects.length; i++) {
        if(result.projects[i].project.projectId >= 137) {
            console.log("title :" + result.projects[i].details.title);
        }
      }
      console.log("res :" + JSON.stringify(result));
      res.render('templates/admin/project/index', result);
    }
  });
});

router.get('/export', authorize('Admin', '/admin/login'), function (req, res) {
  var apiAdminProjectModel = new ApiAdminProjectModel();

  apiAdminProjectModel.getAllFormatted({}, function(err, result) {
    if (err) {
      //BUG: Need to show 500 page
      res.json(err);
    } else {
      var fields = [
        { label: 'Project ID', value: 'projectId'},
        { label: 'Title', value: 'title'},
        { label: 'Project Category', value: 'projectCategory'},
        { label: 'Description', value: 'description'},
        { label: 'Team', value: 'teamMembers'},
        { label: 'Mentor', value: 'mentor'},
        { label: 'Status', value: 'status'},
        { label: 'Abstract Submitted', value: 'switches.abstractLocked' },
        { label: 'Poster Submitted', value: 'switches.posterSubmitted' },
        { label: 'Published For Symposium', value: 'switches.publishSymposium' }
      ];
      var csv = json2csv.parse(result.formattedProjects, {
        fields: fields,
      });

      res.attachment('Projects.csv');
      res.status(200).send(csv);
    }
  });
});

router.get('/exportReviewScores', authorize('Admin', '/admin/login'), function (req, res) {
  var apiAdminProjectModel = new ApiAdminProjectModel();

  apiAdminProjectModel.getAllFormatted({}, function(err, result) {
    if (err) {
      //BUG: Need to show 500 page
      res.json(err);
    } else {
      var fields = [
        { label: 'Project ID', value: 'projectId'},
        { label: 'Title', value: 'title'},
        { label: 'Reviewer1 Name', value: 'r1'},
        { label: 'Score', value: 'r1Score'},
        { label: 'Reviewer2 Name', value: 'r2'},
        { label: 'Score', value: 'r2Score'},
        { label: 'Requires Resubmission', value: 'requiresResubmission'},

      ];
      var csv = json2csv.parse(result.formattedProjects, {
        fields: fields,
      });

      res.attachment('ReviewScores.csv');
      res.status(200).send(csv);
    }
  });
});

module.exports = router;
