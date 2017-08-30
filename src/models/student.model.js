export default (sequelize, DataTypes) => {
  var Student = sequelize.define('Student', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
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
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    studentNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    barcode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('member', 'under_review', 'deactivated'),
      allowNull: false
    },
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
  }

  return Student
}
