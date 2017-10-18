import bcrypt from 'bcrypt'
const saltRounds = 10

export default (sequelize, DataTypes) => {
  var Student = sequelize.define('Student', {
    familyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    giveName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    admissionYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    sex: {
      type: DataTypes.ENUM('female', 'male', 'others'),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    studentCard: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    studentNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    joinDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    },
    barcode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('member', 'under_review', 'deactivated'),
      allowNull: false
    }
  }, {
    hooks: {
      beforeSave: (user, option) => {
        user.password = bcrypt.hashSync(user.password, saltRounds)
      }
    }
  })

  Student.associate = (models) => {
    Student.belongsToMany(models.Event,
      {
        through: 'StudentEvents',
        foreignKey: 'studentId',
        constraints: true,
        onDelete: 'cascade'
      }
    )
    Student.hasMany(models.AccessToken,
      {
        foreignKey: 'studentId',
        constraints: true,
        onDelete: 'cascade'
      })
    Student.hasMany(models.StudentLog,
      {
        foreignKey: 'studentId',
        constraints: true,
        onDelete: 'cascade'
      })
  }

  return Student
}
