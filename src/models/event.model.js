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
      type: DataTypes.ENUM('draft', 'under_review', 'approved', 'held', 'canceled', 'rejected'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    indexes: [
      // add a FULLTEXT index
      { type: 'FULLTEXT', name: 'text_idx', fields: ['description', 'eventTitle'] }
    ]
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
