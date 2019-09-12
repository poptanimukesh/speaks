module.exports = function(sequelize, DataTypes) {
  return sequelize.define('project', {
    ProjectID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    TeamID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MentorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DetailsID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    name: { singular: 'Project', plural: 'Projects' },
    tableName: 'project',
    timestamps: false
  });
};
