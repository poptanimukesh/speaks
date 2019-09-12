var debug = require('debug')('app:models:api:admin:project:getAll');
var verbose = require('debug')('verbose/app:models:api:admin:project:getAll');
var Q = require('q');
var DBManager = require('../../../../db/index');
var format = require('string-format');

var ApiProjectGetModel = require('../../project/get');
var ProxyModel = require('../../../proxy');
var NameModel = require('../../../project/name');
var UrlsModel = require('../../../project/urls');

var dbManager = new DBManager();
var nameModel = new NameModel();
var urlsModel = new UrlsModel();

var isTrue = function(value) {
  if (value == undefined || value == null || value == false || value == "false" || value == "") {
    return false;
  } else {
    return true;
  }
}

var columns = [
  { name: "projectId", title: "Project ID", visible: true, breakpoints: "xs" },
  { name: "title", title: "Title", vislble: true },
  { name: "projectCategory", title: "Category", visible: true },
  { name: "status", title: "Status", visible: true },
  { name: "linkAbstract", title: "Abstract Link", visible: true },
  { name: "linkPoster", title: "Poster Link", visible: true },
  { name: "linkProject", title: "Project Page", visible: true },
  { name: "linkPublish", title: "Publish", visible: false },
  { name: "teamMembers", title: "Team Members", visible: true, breakpoints: "xs sm md lg" },
  { name: "mentor", title: "Mentor", visible: true, breakpoints: "xs sm md lg" },
  { name: "description", title: "Description", visible: true, breakpoints: "xs sm md lg" },
  { name: "adminUrl", title: "Admin URL", visible: true, breakpoints: "xs sm md lg" },
  { name: "mentorUrl", title: "Mentor URL", visible: true, breakpoints: "xs sm md lg" },
  { name: "studentUrl", title: "Student URL", visible: true, breakpoints: "xs sm md lg" },
  { name: "detailsId", title: "Project Details ID", visible: false },
];

var ApiAdminProjectGetAllModel = function() {
  this.pspQueryManager = dbManager.pspQueryManager();
  // debug('pspQueryManager', this.pspQueryManager);
  this.syllabusQueryManager = dbManager.syllabusQueryManager();
}

ApiAdminProjectGetAllModel.prototype.getColumns = function(data, callback) {
  verbose('getColumns');
  callback(undefined, columns);
}

ApiAdminProjectGetAllModel.prototype.getAll = function(data, callback) {
  verbose('getAll');
  var that = this;

  that.result = {
      projects: []
  };
  that.temp = {};

  that.getAllHelper(data).then(function(results) {
      verbose('getAllHelper');
      return that.getEach(results);
  }).then(function(results) {
      verbose('admin get each ... then');
      callback(undefined, that.result);
  }).catch(function(err) {
      verbose('ERROR: admin get all helper ... error then');
      debug(err);
      callback(err, undefined);
  });
}

ApiAdminProjectGetAllModel.prototype.getAllFormatted = function(data, callback) {
  verbose('getAllFormatted');
  var that = this;

  that.result = {
    projects: []
  };
  that.temp = {};

  // var columns = [
  //   { name: "projectId", title: "Project ID", visible: true, breakpoints: "xs" },
  //   { name: "title", title: "Title", vislble: true },
  //   { name: "projectCategory", title: "Category", visible: true },
  //   { name: "linkAbstract", title: "Abstract Link", visible: true },
  //   { name: "linkPoster", title: "Poster Link", visible: true },
  //   { name: "linkProject", title: "Project Page", visible: true },
  //   { name: "linkPublish", title: "Publish", visible: true },
  //   { name: "status", title: "Status", visible: true },
  //   { name: "teamMembers", title: "Team Members", visible: true, breakpoints: "xs sm md lg" },
  //   { name: "mentor", title: "Mentor", visible: true, breakpoints: "xs sm md lg" },
  //   { name: "description", title: "Description", visible: true, breakpoints: "xs sm md lg" },
  //   { name: "detailsId", title: "Project Details ID", visible: false },
  // ];

  that.getAllHelper(data).then(function(results) {
    verbose('getAllHelper ... then');
    return that.getEach(results);
  }).then(function(results) {
    verbose('admin get each ... then');
    var formattedProjects = [];
    var meta = {
      count: {
        "In Progress": 0,
        "Complete": 0,
        "Published": 0,
        "Total": 0,
        "StudentComments": 0,
        "AdminComments": 0,
      }
    };

    for (var i = 0; i < that.result.projects.length; ++i) {
      var project = that.result.projects[i];
      if (project.project.active) {
        var mentor = nameModel.formatStandard(project.mentors.members[0].LastName, project.mentors.members[0].FirstName, project.mentors.members[0].Email);
        var teamArr = [];
        for (var j = 0; j < project.team.members.length; ++j) {
          teamArr.push(nameModel.formatStandard(project.team.members[j].LastName, project.team.members[j].FirstName, project.team.members[j].Email));
        }
        var status = project.details.projectCategory != undefined && project.details.abstract_locked != undefined && project.details.poster_submitted != undefined;
        status = status && project.details.projectCategory != "" && project.details.poster_submitted != "" && project.details.abstract_locked != "";
        status = status && project.details.abstract_locked != "false" && project.details.poster_submitted != "false";
        status = status ? "Complete" :  "In Progress";
        if (status && project.details.publish_symposium == "true") {
          status = "Published";
        }
        ++meta.count[status];
        ++meta.count["Total"];
        if (project.details.aCmt && project.details.aCmt != "") {
          ++meta.count["AdminComments"];
        }
        if (project.details.sCmt && project.details.sCmt != "") {
          ++meta.count["StudentComments"];
        }
        var adminUrls = urlsModel.getProjectUrlsForId(project.proxyId.admin);
        var mentorUrls = urlsModel.getProjectUrlsForId(project.proxyId.mentor);
        var studentUrls = urlsModel.getProjectUrlsForId(project.proxyId.student);
        var formattedProject = {
          projectId: project.project.projectId,
          title: project.details.title,
          symposium_title: project.details.symposium_title,
          projectCategory: project.details.projectCategory,
          status: status,
          links: {
            proxyId: project.proxyId.admin,
            abstract: isTrue(project.details.abstract_locked) ? studentUrls.viewAbstract : project.details.abstract_locked,
            poster: isTrue(project.details.poster_submitted) ? studentUrls.viewPoster : project.details.poster_submitted,
            project: adminUrls.project,
            comments: {
              student: (project.details.sCmt != undefined && project.details.sCmt != ""),
              admin: (project.details.aCmt != undefined && project.details.aCmt != "")
            }
          },
          linkPublish: adminUrls.publish,
          teamMembers: teamArr.join(", "),
          mentor: mentor,
          description: project.details.description.trimLeft().trimRight(),
          adminUrl: adminUrls.proxyUrl,
          mentorUrl: mentorUrls.proxyUrl,
          studentUrl: studentUrls.proxyUrl,
          detailsId: project.project.detailsId,
          switches: {
            proxyId: project.proxyId.admin,
            abstractLocked: project.details.abstract_locked,
            posterSubmitted: project.details.poster_submitted,
            publishSymposium: project.details.publish_symposium,
            misc: {
              studentHasCommented: (project.details.sCmt != undefined && project.details.sCmt != ""),
              adminHasCommented: (project.details.aCmt != undefined && project.details.aCmt != "")
            }
          },

          r1: project.details.r1,
          r1Score: project.details.r1_score,
          r2: project.details.r2,
          r2Score: project.details.r2_score,
          requiresResubmission: project.details.requiresResumbission,
        };
        formattedProjects.push(formattedProject);
      }
    }
    callback(undefined, {
      formattedProjects: formattedProjects,
      meta: meta
    });
  }).catch(function(err) {
    verbose('ERROR: admin get all formatted ... error then');
    debug(err);
    callback(err, undefined);
  })
}

ApiAdminProjectGetAllModel.prototype.getAllHelper = function(data) {
    verbose('admin get all helper ...');
    var that = this;
    var deferred = Q.defer();
    var query = "SELECT `ProjectID` FROM `project` WHERE `Timestamp` like '2019%'";
    console.log("all query: " + query);

    that.pspQueryManager.query(query, function(err, results, fields) {
        if (err) {
            verbose('ERROR: admin get all helper ... error done');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('admin get all helper ... done');

            deferred.resolve(results);
        }
    });

    return deferred.promise;
}

ApiAdminProjectGetAllModel.prototype.getEach = function(projects) {
    verbose('admin get each ...');
    var that = this;
    var deferred = Q.defer();

    var promises = [];
    for (var i in projects) {
        promises.push(that.getEachHelper(projects[i]));
    }
    Q.all(promises).then(function(results) {
        verbose('admin get each ... done');

        deferred.resolve(results);
    }).catch(function(err) {
        verbose('ERROR: admin get each ... error done');
        debug(err);
        deferred.reject(err);
    });

    return deferred.promise;
}

ApiAdminProjectGetAllModel.prototype.getEachHelper = function(project) {
    verbose('admin get each helper ...');
    var that = this;
    var deferred = Q.defer();

    var apiProjectGetModel = new ApiProjectGetModel();
    verbose(project);
    apiProjectGetModel.getAll({
        projectId: project.ProjectID
    }, function(err, results) {
        if (err) {
            verbose('ERROR: get each helper ... error');
            debug(err);
            deferred.reject(err);
        } else {
            verbose('get each helper ... done');

            results.proxyId = new ProxyModel().createProxyIds(results.project.projectId);
            that.result.projects.push(results);
            deferred.resolve(results);
        }
    });

    return deferred.promise;
}

module.exports = ApiAdminProjectGetAllModel;
