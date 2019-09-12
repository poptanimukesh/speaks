module.exports = function(sequelize, DataTypes) {
  return sequelize.define('student', {
    StudentID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
  }, {
    name: {singular: 'Student', plural: 'Students'},
    tableName: 'student',
    timestamps: false
  });
}
