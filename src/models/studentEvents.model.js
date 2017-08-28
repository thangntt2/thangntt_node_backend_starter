export default (sequelize, DataTypes) => {
  var StudentEvents = sequelize.define('StudentEvents')

  StudentEvents.associate = (models) => {
    StudentEvents.belongsTo(models.Student)
    StudentEvents.belongsTo(models.Event)
  }

  return StudentEvents
}
