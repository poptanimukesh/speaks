var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:reviewer:project:index');
var passport = require('passport');

var ApiAdminProjectModel = require('../../../models/api/admin/project/getAll');
var authorize = require('../../../middleware/authorize');

var Cryptr = require('cryptr');
var cryptr = new Cryptr(require('../../../cryptokey.json').secret);

var json2csv = require('json2csv');

router.get('/', authorize('Reviewer', '/admin/login'), function (req, res) {
  console.log('hii');
  var apiAdminProjectModel = new ApiAdminProjectModel();

  apiAdminProjectModel.getAll({}, function(err, result) {
    if (err) {
      //BUG: Need to show 500 page
      res.json(err);
    } else {
      res.render('templates/reviewer/project/index', result);
    }
  });
});

router.get('/export', authorize('Reviewer', '/admin/login'), function (req, res) {
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

module.exports = router;
