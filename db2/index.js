'use strict';

const Sequelize = require('sequelize');
var fs = require('fs');
const Op = Sequelize.Op;

if (global._db == undefined) {
  const pspSequelize = new Sequelize({
    dialect: 'mysql',
    host: 'uscpharmdbmysql.mysql.database.azure.com',
    database: 'pharmdscholarlyproject',
    username: 'scholarlyserver@uscpharmdbmysql',
    password: 'enaleadwilcounge',
    connectionLimit : 50,
    waitForConnections: true,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync('BaltimoreCyberTrustRoot.crt.pem')
      }
    },
    pool: {
      max: 50,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
  const syllabusSequelize = new Sequelize({
    dialect: 'mysql',
    host: 'uscpharmdbmysql.mysql.database.azure.com',
    database: 'syllabus',
    username: 'scholarlyserver@uscpharmdbmysql',
    password: 'enaleadwilcounge',
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync('BaltimoreCyberTrustRoot.crt.pem')
      }
    }
  });

  const User = pspSequelize.import('../db2/models2/schema/pharmdscholarlyproject/user');
  const Student = pspSequelize.import('../db2/models2/schema/pharmdscholarlyproject/student');
  const StudentTeam = pspSequelize.import('../db2/models2/schema/pharmdscholarlyproject/studentteam');
  const Project = pspSequelize.import('../db2/models2/schema/pharmdscholarlyproject/project');
  const Details = pspSequelize.import('../db2/models2/schema/pharmdscholarlyproject/details');
  const Presentation = pspSequelize.import('../db2/models2/schema/pharmdscholarlyproject/presentation');
  const ProjectLecturer = pspSequelize.import('../db2/models2/schema/pharmdscholarlyproject/projectlecturer');
  const EmailTemplate = pspSequelize.import('../db2/models2/schema/pharmdscholarlyproject/emailtemplate');
  const Lecturer = syllabusSequelize.import('../db2/models2/schema/syllabus/lecturer');

  StudentTeam.hasMany(Student, {foreignKey: 'StudentID', sourceKey: 'StudentID'});
  Student.belongsTo(StudentTeam, {foreignKey: 'StudentID', targetKey: 'StudentID'});
  Project.hasMany(StudentTeam, {foreignKey: 'TeamID', sourceKey: 'TeamID'});
  Project.hasMany(Details, {foreignKey: {name: 'DetailsID'}, sourceKey: 'DetailsID'});
  Project.hasMany(ProjectLecturer, {foreignKey: {name: 'ProjectID', sourceKey: 'ProjectID'}});

  global._db = {
    User: User,
    Student: Student,
    StudentTeam: StudentTeam,
    Project: Project,
    Details: Details,
    Presentation: Presentation,
    Lecturer: Lecturer,
    ProjectLecturer: ProjectLecturer,
    EmailTemplate: EmailTemplate
  };
}

module.exports = global._db;
