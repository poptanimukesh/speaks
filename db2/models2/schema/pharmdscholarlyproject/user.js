module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    UserID: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Role: {
      type: DataTypes.ENUM('Admin', 'Mentor', 'Student'),
      defaultValue: 'Student',
      allowNull: false
    }
  }, {
    name: {singular: 'User', plural: 'Users'},
    tableName: 'user',
    timestamps: false
  });
}
