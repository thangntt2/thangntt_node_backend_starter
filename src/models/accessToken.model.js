export default (sequelize, DataTypes) => {
  var AccessToken = sequelize.define('AccessToken', {
    accessToken: DataTypes.STRING,
    expiredTime: DataTypes.BIGINT,
    userType: DataTypes.ENUM('student', 'sponsor', 'admin')
  })

  AccessToken.associate = (models) => {
    AccessToken.belongsTo(models.Student)
    AccessToken.belongsTo(models.Sponsor)
    AccessToken.belongsTo(models.Admin)
  }

  return AccessToken
}
