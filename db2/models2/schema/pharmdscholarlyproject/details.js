module.exports = function(sequelize, DataTypes) {
  return sequelize.define('details', {
    DetailsID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    DataKey: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    DataValue: {
      type: DataTypes.TEXT
    }
  }, {
    name: {singular: 'Detail', plural: 'Details'},
    tableName: 'details',
    timestamps: false
  });
}
