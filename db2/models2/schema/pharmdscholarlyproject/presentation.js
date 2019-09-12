module.exports = function(sequelize, DataTypes) {
  return sequelize.define('presentation', {
    PresentationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ProjectID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Meeting: {
      type: DataTypes.STRING
    },
    Location: {
      type: DataTypes.STRING
    },
    Date: {
      type: DataTypes.STRING
    },
    Title: {
      type: DataTypes.STRING
    },
    Authors: {
      type: DataTypes.STRING
    }
  }, {
    name: {singular: 'Presentation', plural: 'Presentations'},
    tableName: 'presentation',
    timestamps: false
  });
}
