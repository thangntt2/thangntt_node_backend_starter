export default (sequelize, DataTypes) => {
  var Sponsor = sequelize.define('Sponsor', {
    companyName: {
      type: DataTypes.STRING, //unique luôn cái này
      allowNull: false
    },
    staffName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    staffRubyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    positon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyLogo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ceoName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfEstablishedCompany: {
      type: DataTypes.DATE,
      allowNull: false
    },
    numberOfEmployees: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false
    },
    websiteUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
   	introduction1: {
      type: DataTypes.TEXT,
      allowNull: false
    },
   	introduction2: {
      type: DataTypes.TEXT,
      allowNull: false
    },
   	contactStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
   	contactDeadline: {
      type: DataTypes.STRING,
      allowNull: false
    },
  })

  Sponsor.associate = (models) => {
    Sponsor.hasMany(models.Event)
    Sponsor.hasMany(models.AccessToken)
  }

  return Sponsor
}
