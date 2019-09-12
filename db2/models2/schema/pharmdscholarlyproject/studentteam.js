module.exports = function(sequelize, DataTypes) {
  return sequelize.define('studentteam', {
    TeamID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    StudentID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
  }, {
    name: {singular: 'StudentTeam', plural: 'StudentTeams'},
    tableName: 'student_team',
    timestamps: false
  });
}
