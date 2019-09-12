'use strict';

var helper = {
  maps: {
    Student: function(student) {
      if (!student) { return student; }
      return {
        StudentID: student.dataValues.StudentID,
        Email: student.dataValues.Email,
        FirstName: student.dataValues.FirstName,
        LastName: student.dataValues.LastName,
        Active: student.dataValues.Active
      }
    },
    Students: function(students) {
      var result = [];
      for (var i in students) {
        result.push(helper.maps.Student(students[i]));
      }
      return result;
    },
    StudentTeam: function(studentTeam) {
      if (!studentTeam) { return studentTeam; }
      return {
        TeamID: studentTeam.dataValues.TeamID,
        Student: helper.maps.Student(studentTeam.dataValues.Students[0])
      }
    },
    StudentTeams: function(studentTeams) {
      var result = [];
      for (var i in studentTeams) {
        result.push(helper.maps.StudentTeam(studentTeams[i]));
      }
      return result;
    },
    StudentTeamsAggregated: function(studentTeams) {
      var result = {};
      for (var i in studentTeams) {
        var studentTeam = studentTeams[i];
        if (!result[studentTeam.TeamID]) {
          result[studentTeam.TeamID] = {
            Students: []
          }
        }
        result[studentTeam.TeamID].Students.push(studentTeam.Student);
      }
      return result;
    },
    StudentTeamsAggregatedAsObject: function(studentTeamsAggregated) {
      var result = {
        TeamID: Object.keys(studentTeamsAggregated)[0],
        Students: studentTeamsAggregated[Object.keys(studentTeamsAggregated)[0]].Students
      };
      return result;
    },
    Project: function(project) {
      if (!project) { return project; }
      return {
        ProjectID: project.dataValues.ProjectID,
        TeamID: project.dataValues.TeamID,
        MentorID: project.dataValues.MentorID,
        DetailsID: project.dataValues.DetailsID,
        Active: project.dataValues.Active
      }
    },
    ProjectAggregated: function(project) {
      if (!project) { return project; }
      var studentTeams = helper.maps.StudentTeams(project.dataValues.StudentTeams);
      var studentTeamsAggregated = helper.maps.StudentTeamsAggregated(studentTeams);
      var studentTeamsAggregatedAsObject = helper.maps.StudentTeamsAggregatedAsObject(studentTeamsAggregated);
      var detailsAggregatedAsObject = helper.maps.DetailsAggregatedAsObject(project.dataValues.Details);
      var projectLecturers = helper.maps.ProjectLecturers(project.dataValues.ProjectLecturers);
      var result = helper.maps.Project(project);
      result.Students = studentTeamsAggregatedAsObject.Students;
      result.Details = detailsAggregatedAsObject;
      result.Lecturers = projectLecturers;
      return result;
    },
    ProjectsAggregated: function(projects) {
      var result = [];
      for (var i in projects) {
        result.push(helper.maps.ProjectAggregated(projects[i]));
      }
      return result;
    },
    Projects: function(projects) {
      var result = [];
      for (var i in projects) {
        result.push(helper.maps.Project(projects[i]));
      }
      return result;
    },
    DetailsAggregatedAsObject: function(details) {
      var result = {};
      for (var i in details) {
        var detail = details[i];
        result[detail.DataKey] = detail.DataValue;
      }
      return result;
    },
    ProjectLecturer: function(projectLecturer) {
      projectLecturer.LecturerID;
    },
    ProjectLecturers: function(projectLecturers) {
      var result = [];
      for (var i in projectLecturers) {
        result.push(projectLecturers[i].LecturerID);
      }
      return result;
    },
    Lecturer: function(lecturer) {
      if (!lecturer) { return lecturer; }
      return {
        LecturerID: lecturer.dataValues.LecturerID,
        LastName: lecturer.dataValues.LastName,
        FirstName: lecturer.dataValues.FirstName,
        Email: lecturer.dataValues.Email,
        Phone: lecturer.dataValues.Phone,
        Institution: lecturer.dataValues.Institution,
        Department: lecturer.dataValues.Department,
        Title: lecturer.dataValues.Title,
        Status: lecturer.dataValues.Status
      }
    },
    Lecturers: function(lecturers) {
      var result = [];
      for (var i in lecturers) {
        var lecturer = lecturers[i];
        result.push(helper.maps.Lecturer(lecturer));
      }
      return result;
    },
    EmailTemplate: function(emailtemplate) {
      if (!emailtemplate) { return emailtemplate; }
      return {
        EmailType: emailtemplate.dataValues.EmailType,
        CCEmailId: emailtemplate.dataValues.CCEmailId,
        BCCEmailId: emailtemplate.dataValues.BCCEmailId,
        EmailSubject: emailtemplate.dataValues.EmailSubject,
        EmailBody: emailtemplate.dataValues.EmailBody
      }
    },
    EmailTemplates: function(emailtemplates) {
      var result = [];
      for (var i in emailtemplates) {
        result.push(helper.maps.EmailTemplate(emailtemplates[i]));
      }
      return result;
    }
  }
}

module.exports = helper;
