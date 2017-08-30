export default (sequelize, DataTypes) => {
  var AccessToken = sequelize.define('AccessToken', {
    accessToken: DataTypes.STRING,
    expiredTime: DataTypes.BIGINT,
    userType: DataTypes.ENUM('student', 'sponsor', 'admin')
  })

  AccessToken.associate = (models) => {
    AccessToken.belongsTo(models.Student,
      {
        foreignKey: 'studentId',
        constraints: true,
        onDelete: 'cascade'
      })
    AccessToken.belongsTo(models.Sponsor,
      {
        foreignKey: 'sponsorId',
        constraints: true,
        onDelete: 'cascade'
      })
    AccessToken.belongsTo(models.Admin,
      {
        foreignKey: 'adminId',
        constraints: true,
        onDelete: 'cascade'
      })
  }

  return AccessToken
}
