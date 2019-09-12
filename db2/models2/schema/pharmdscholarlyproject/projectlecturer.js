module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projectlecturer', {
    ProjectID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    LecturerID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
  }, {
    name: {singular: 'ProjectLecturer', plural: 'ProjectLecturers'},
    tableName: 'project_lecturer',
    timestamps: false
  });
}
