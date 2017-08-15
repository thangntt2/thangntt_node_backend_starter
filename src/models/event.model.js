export default (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  })

  Event.associate = (models) => {
    Event.belongsToMany(models.Student, {through: 'StudentEvents'})
  }

  return Event
}
