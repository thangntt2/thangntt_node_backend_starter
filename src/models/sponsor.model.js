import bcrypt from 'bcrypt'
const saltRounds = 10

const hashPassword = async (user, options) => {
  user.password = await bcrypt.hashSync(user.password, saltRounds)
}

export default (sequelize, DataTypes) => {
  var Sponsor = sequelize.define('Sponsor', {
    companyName: {
      type: DataTypes.STRING,
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
    companyAddress1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyAddress2: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyAddress3: {
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
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    }
  })

  Sponsor.associate = (models) => {
    Sponsor.hasMany(models.Event,
      {
        foreignKey: 'sponsorId',
        constraints: true,
        onDelete: 'cascade'
      })

    Sponsor.hasMany(models.AccessToken,
      {
        foreignKey: 'sponsorId',
        constraints: true,
        onDelete: 'cascade'
      })
  }

  Sponsor.beforeUpdate(hashPassword)
  Sponsor.beforeCreate(hashPassword)

  return Sponsor
}
