export default (sequelize, DataTypes) => {
  var Student = sequelize.define('Student', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  })

  Student.associate = (models) => {
    Student.belongsToMany(models.Event, {through: 'StudentEvents'})
    Student.hasMany(models.AccessToken)
  }

  return Student
}
