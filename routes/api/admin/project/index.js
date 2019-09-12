var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:api_v1');

var ApiAdminProjectGetAllModel = require('../../../../models/api/admin/project/getAll');
var ProxyModel = require('../../../../models/proxy');
var UrlsModel = require('../../../../models/project/urls');

var ProjectFindModel = require('../../../../models2/project/find');
var LegacyProjectHelperModel = require('../../../../models2/legacy/project');

var authorize = require('../../../../middleware/authorize');

var proxyModel = new ProxyModel();
var urlsModel = new UrlsModel();
var projectFindModel = new ProjectFindModel();
var legacyProjectHelperModel = new LegacyProjectHelperModel();

var Cryptr = require('cryptr');
var cryptokey = require('../../../../cryptokey.json');
var cryptr = new Cryptr(cryptokey.secret);

router.get('/', authorize('Admin', '/admin/login'), function(req, res) {
  projectFindModel.findAllByAggregated({
  }).then(function(results) {
    var result = legacyProjectHelperModel.legacyFormatWithMetaProjectsSync(results);
    res.json({
        status: 'success',
        message: 'All Projects fetched',
        data: result,
    });
  }).catch(function(err) {
    debug(err);
    res.json({
        status: 'error',
        message: 'Error in fetch all project details',
        details: err
    });
  });
});

router.get('/raw', authorize('Admin', '/admin/login'), function(req, res) {
  var apiAdminProjectGetAllModel = new ApiAdminProjectGetAllModel();
  apiAdminProjectGetAllModel.getAll({}, function(err, result) {
    if (err) {
      res.json({
          status: 'error',
          message: 'Error in fetch all project details',
          details: err
      });
    } else {
      res.json({
          status: 'success',
          message: 'All Projects fetched',
          data: result,
      });
    }
  });
});

router.get('/published', function(req, res) {
  var apiAdminProjectGetAllModel = new ApiAdminProjectGetAllModel();
  apiAdminProjectGetAllModel.getAllFormatted({}, function(err, result) {
    if (err) {
      res.json({
        status: 'error',
        message: 'Error in fetch all project details',
        details: err
      });
    } else {
      var data = [];
      for (var i = 0; i < result.formattedProjects.length; ++i) {
        var project = result.formattedProjects[i];
        if (project.switches.publishSymposium) {
          var proxyId = proxyModel.createProxyIdForRole("public", project.projectId);
          var urls = urlsModel.getProjectUrlsForId(proxyId);
          data.push({
            projectId: project.projectId,
            title: project.title,
            symposium_title: project.symposium_title,
            teamMembers: project.teamMembers,
            mentor: project.mentor,
            description: project.description,
            projectCategory: project.projectCategory,
            links: {
              abstract: urls.viewAbstract,
              poster: urls.viewPoster,
            }
          });
        }
      }

      res.json({
        status: 'success',
        message: 'All Projects fetched',
        data: data,
      });
    }
  });
});

router.get('/columns', function(req, res) {
  var apiAdminProjectGetAllModel = new ApiAdminProjectGetAllModel();

  apiAdminProjectGetAllModel.getColumns({}, function(err, result) {
    res.json({
      status: 'success',
      data: result
    });
  });
});

module.exports = router;
