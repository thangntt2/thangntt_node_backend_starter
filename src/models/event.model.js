export default (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    eventTitle: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startingTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    recruitmentNumbers: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    images: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('draft', 'under_review', 'awaitings_holding', 'held'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  })

  Event.associate = (models) => {
    Event.belongsToMany(models.Student, {through: 'StudentEvents'})
    Event.belongsTo(models.Sponsor)
  }

  return Event
}
