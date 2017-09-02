export default (sequelize, DataTypes) => {
  const StudentEvents = sequelize.define('StudentEvents')

  StudentEvents.associate = (models) => {
    StudentEvents.belongsTo(models.Student,
      {
        foreignKey: 'studentId',
        constraints: true,
        onDelete: 'cascade'
      })
    StudentEvents.belongsTo(models.Event,
      {
        foreignKey: 'eventId',
        constraints: true,
        onDelete: 'cascade'
      })
  }

  return StudentEvents
}
