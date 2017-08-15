export default (sequelize, DataTypes) => {
  var Student = sequelize.define('Student', {
    username: DataTypes.STRING
  })

  Student.associate = (models) => {
    Student.belongsToMany(models.Event, {through: 'StudentEvents'})
  }

  return Student
}
