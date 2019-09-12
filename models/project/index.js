var debug = require('debug')('app:models:project:index');
var verbose = require('debug')('verbose:app:models:project:index');
var Q = require('q');

var ApiProjectGetModel = require('../../models/api/project/get');
var UrlsModel = require('./urls');
var ProxyModel = require('../proxy');
var proxyModel = new ProxyModel();

var apiProjectGetModel = new ApiProjectGetModel();
var urlsModel = new UrlsModel();
var pageModel = {
    //TODO: Move to locales
    sections: [{
    //     key: "information",
    //     text: "Project Information",
    //     enabled: true,
    //     linkKey: "info",
    //     status: true,
    // }, {
    //     key: "abstract",
    //     text: "Edit Abstract",
    //     enabled: true,
    //     linkKey: "abstract",
    //     status: false,
    // }, {
        key: "text",
        text: "Edit Text",
        enabled: true,
        linkKey: "text",
        status: false,
    }, {
        key: "outcomes",
        text: "Edit Program Outcomes",
        enabled: true,
        linkKey: "outcomes",
        status: false,
    }, {
        key: "citations",
        text: "Edit Citations",
        enabled: true,
        linkKey: "citations",
        status: false,
    }]
};

var ProjectModel = function ProjectModel() {
};

ProjectModel.prototype.getProjectDetails = function(proxyId, callback) {
  proxyIdDecryptSplit = proxyModel.roleDecryptSplit(proxyId);
  var role = proxyIdDecryptSplit[0];
  var projectId = proxyIdDecryptSplit[1];

  var data = {
      page: pageModel,
  };

  apiProjectGetModel.getAll({projectId: projectId}, function(err, result) {
      if (err) {
          verbose('ERROR: projectModel/getProjectDetails: +apiProjectGetModel/getAll/callback ... error');
          debug(err);
          callback(err, undefined);
      } else {
          verbose('projectModel/getProjectDetails: +apiProjectGetModel/getAll/callback');
          verbose(result);
          result.proxyId = proxyId;
          result.urls = urlsModel.getProjectUrlsForId(proxyId);
          result.role = role;
          result.page = pageModel;
          callback(undefined, result);
      }
  });
}



module.exports = ProjectModel;
