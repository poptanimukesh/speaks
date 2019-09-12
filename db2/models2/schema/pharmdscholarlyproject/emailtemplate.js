module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emailtemplate', {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    EmailType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CCEmailId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    BCCEmailId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    EmailSubject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    EmailBody: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    name: { singular: 'EmailTemplate', plural: 'EmailTemplates' },
    tableName: 'email_template',
    timestamps: false
  });
};
