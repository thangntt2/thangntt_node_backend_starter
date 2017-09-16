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
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    recruitmentNumbers: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    images: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM('draft', 'under_review', 'awaitings_holding', 'held'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  })

  Event.associate = (models) => {
    Event.belongsToMany(models.Student,
      {
        through: 'StudentEvents',
        foreignKey: 'eventId',
        constraints: true,
        onDelete: 'cascade'
      }
    )

    Event.belongsTo(models.Sponsor,
      {
        foreignKey: 'sponsorId',
        constraints: true,
        onDelete: 'cascade'
      })
  }

  return Event
}
