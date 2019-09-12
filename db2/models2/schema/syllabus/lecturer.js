module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lecturer', {
    LecturerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    LastName: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    FirstName: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    // MiddleInitial: {
    //   type: DataTypes.CHAR(2),
    //   allowNull: true
    // },
    // Active: {
    //   type: DataTypes.ENUM('YES','NO'),
    //   allowNull: true,
    // },
    Institution: {
      type: DataTypes.STRING(80),
      allowNull: true,
      defaultValue: 'Univeristy of Southern California'
    },
    Department: {
      type: DataTypes.STRING(80),
      allowNull: true,
      defaultValue: null
    },
    // Website: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true
    // },
    // Initials: {
    //   type: DataTypes.CHAR(4),
    //   allowNull: true
    // },
    Status: {
      type: DataTypes.ENUM('Pharmacy','USC','Resident','External','Other','Former','Sponsor'),
      allowNull: true,
      defaultValue: 'Sponsor'
    },
    Email: {
      type: DataTypes.STRING(80),
      allowNull: true,
      unique: true
    },
    // Degrees: {
    //   type: DataTypes.STRING(45),
    //   allowNull: true
    // },
    Phone: {
      type: DataTypes.CHAR(18),
      allowNull: true
    },
    // Office: {
    //   type: DataTypes.STRING(75),
    //   allowNull: true
    // },
    Title: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    // USStatus: {
    //   type: DataTypes.ENUM('citizen','resident','alien'),
    //   allowNull: true
    // },
    // Address1: {
    //   type: DataTypes.STRING(256),
    //   allowNull: true
    // },
    // Address2: {
    //   type: DataTypes.STRING(256),
    //   allowNull: true
    // },
    // CityStateZip: {
    //   type: DataTypes.STRING(256),
    //   allowNull: true
    // },
    // Country: {
    //   type: DataTypes.STRING(100),
    //   allowNull: true
    // },
    // VendorNum: {
    //   type: DataTypes.STRING(20),
    //   allowNull: true
    // },
    // LEFormMode: {
    //   type: DataTypes.ENUM('Restrict','Normal'),
    //   allowNull: true,
    //   defaultValue: 'Normal'
    // },
    // UCR_Safe: {
    //   type: DataTypes.ENUM('Safe','Silly'),
    //   allowNull: true,
    //   defaultValue: 'Safe'
    // }
  }, {
    name: {singular: 'Lecturer', plural: 'Lecturers'},
    tableName: 'lecturers',
    timestamps: false
  });
}
