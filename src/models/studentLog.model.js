export default (sequelize, DataTypes) => {
  const StudentLog = sequelize.define('StudentLog', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  StudentLog.associate = (models) => {
    StudentLog.belongsTo(models.Student,
      {
        foreignKey: 'studentId',
        constraints: true,
        onDelete: 'cascade'
      })
  }

  return StudentLog
}
