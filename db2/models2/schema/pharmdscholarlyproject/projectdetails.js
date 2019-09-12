module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projectdetails', {
    ProjectID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    DetailsID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Category: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    name: {singular: 'ProjectDetail', plural: 'ProjectDetails'},
    tableName: 'project_details',
    timestamps: false
  });
}
