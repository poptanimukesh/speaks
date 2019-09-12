'use strict';

const Q = require('q');
const debug = require('debug')('app:models2:legacy:project');

const db = require('../../db2/index');
const helper = require('../helper');

const ProxyModel = require('../proxy');
const NameModel = require('../name');
const UrlsModel = require('../urls');

const proxyModel = new ProxyModel();
const nameModel = new NameModel();
const urlsModel = new UrlsModel();

var isTrue = function(value) {
  if (value == undefined || value == null || value == false || value == "false" || value == "") {
    return false;
  } else {
    return true;
  }
}

var LegacyProjectHelperModel = function() {
}

LegacyProjectHelperModel.prototype.wrapProjectSync = function(project) {
  var result = {
    project: {
      active: project.Active,
      projectId: project.ProjectID,
      detailsId: project.DetailsID
    },
    team: {
      teamId: project.TeamID,
      members: project.Students
    },
    mentors: {
      members: project.Lecturers
    },
    details: project.Details,
  };

  return result;
}

LegacyProjectHelperModel.prototype.wrapProjectsSync = function(projects) {
  var results = [];
  for (var i in projects) {
    var project = projects[i];
    results.push(this.wrapProjectSync(project));
  }
  return results;
}

LegacyProjectHelperModel.prototype.legacyFormatProjectSync = function(project) {
  var proxyId = proxyModel.createProxyIds(project.project.projectId);
  project.proxyId = proxyId;

  var mentorArr = [];
  for (var j = 0; j < project.mentors.members.length; ++j) {
    mentorArr.push(nameModel.formatStandard(project.mentors.members[j].LastName, project.mentors.members[j].FirstName, project.mentors.members[j].Email));
  }
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
  var adminUrls = urlsModel.getProjectUrlsForId(project.proxyId.admin);
  var mentorUrls = urlsModel.getProjectUrlsForId(project.proxyId.mentor);
  var studentUrls = urlsModel.getProjectUrlsForId(project.proxyId.student);
  var formattedProject = {
    projectId: project.project.projectId,
    active: project.project.active,
    title: project.details.title,
    symposium_title : project.details.symposium_title,
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
    mentor: mentorArr.join(", "),
    description: project.details.description.trimLeft().trimRight(),
    adminUrl: adminUrls.proxyUrl,
    mentorUrl: mentorUrls.proxyUrl,
    studentUrl: studentUrls.proxyUrl,
    detailsId: project.project.detailsId,
    switches: {
      proxyId: project.proxyId.admin,
      proposalLocked: project.details.proposal_locked,
      abstractLocked: project.details.abstract_locked,
      posterSubmitted: project.details.poster_submitted,
      publishSymposium: project.details.publish_symposium,
      projectDeleted: !project.project.active,
      misc: {
        studentHasCommented: (project.details.sCmt != undefined && project.details.sCmt != ""),
        adminHasCommented: (project.details.aCmt != undefined && project.details.aCmt != ""),
      }
    },
  };
  return formattedProject;
}

LegacyProjectHelperModel.prototype.legacyFormatProjectsSync = function(projects) {
  var results = [];
  for (var i in projects) {
    var project = projects[i];
    results.push(this.legacyFormatProjectSync(project));
  }
  return results;
}

LegacyProjectHelperModel.prototype.legacyFormatWithMetaProjectsSync = function(projects) {
  var formattedProjects = [];
  var meta = {
    count: {
      "In Progress": 0,
      "Complete": 0,
      "Published": 0,
      "Total": 0,
      "StudentComments": 0,
      "AdminComments": 0,
    },
    countActive: {
      "In Progress": 0,
      "Complete": 0,
      "Published": 0,
      "Total": 0,
      "StudentComments": 0,
      "AdminComments": 0,
    }
  };
  for (var i in projects) {
    var project = this.wrapProjectSync(projects[i]);
    var formattedProject = this.legacyFormatProjectSync(project);
    ++meta.count[formattedProject.status];
    ++meta.count["Total"];
    if (project.details.aCmt && project.details.aCmt != "") {
      ++meta.count["AdminComments"];
    }
    if (project.details.sCmt && project.details.sCmt != "") {
      ++meta.count["StudentComments"];
    }
    if (project.project.active) {
      ++meta.countActive[formattedProject.status];
      ++meta.countActive["Total"];
      if (project.details.aCmt && project.details.aCmt != "") {
        ++meta.countActive["AdminComments"];
      }
      if (project.details.sCmt && project.details.sCmt != "") {
        ++meta.countActive["StudentComments"];
      }
    }
    formattedProjects.push(formattedProject)
  }
  return {
    formattedProjects: formattedProjects,
    meta: meta
  };
}

LegacyProjectHelperModel.prototype.legacyFormatWithMetaProjectsSyncReviewers = function(projects,reviewer) {
  var formattedProjects = [];
  var meta = {
    count: {
      "In Progress": 0,
      "Complete": 0,
      "Published": 0,
      "Total": 0,
      "StudentComments": 0,
      "AdminComments": 0,
    },
    countActive: {
      "In Progress": 0,
      "Complete": 0,
      "Published": 0,
      "Total": 0,
      "StudentComments": 0,
      "AdminComments": 0,
    }
  };
  for (var i in projects) {
    if(projects[i].Details.r1 == reviewer || projects[i].Details.r2 == reviewer){
        var project = this.wrapProjectSync(projects[i]);
        var formattedProject = this.legacyFormatProjectSync(project);
        ++meta.count[formattedProject.status];
        ++meta.count["Total"];
        if (project.details.aCmt && project.details.aCmt != "") {
          ++meta.count["AdminComments"];
        }
        if (project.details.sCmt && project.details.sCmt != "") {
          ++meta.count["StudentComments"];
        }
        if (project.project.active) {
          ++meta.countActive[formattedProject.status];
          ++meta.countActive["Total"];
          if (project.details.aCmt && project.details.aCmt != "") {
            ++meta.countActive["AdminComments"];
          }
          if (project.details.sCmt && project.details.sCmt != "") {
            ++meta.countActive["StudentComments"];
          }
        }

        formattedProject["reviewPublished"] = "Not Published";
        if(projects[i].Details.r1 == reviewer && project.details.r1_published=="true"){
          formattedProject["reviewPublished"] = "Published";
        }

        if(projects[i].Details.r2 == reviewer && project.details.r2_published=="true"){
          formattedProject["reviewPublished"] = "Published";
        }

        formattedProjects.push(formattedProject);
    }
  }
  return {
    formattedProjects: formattedProjects,
    meta: meta
  };
}

module.exports = LegacyProjectHelperModel;
