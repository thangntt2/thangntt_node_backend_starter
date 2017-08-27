export default (sequelize, DataTypes) => {
  var Sponsor = sequelize.define('Sponsor', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  })

  Sponsor.associate = (models) => {
    Sponsor.hasMany(models.Event)
    Sponsor.hasMany(models.AccessToken)
  }

  return Sponsor
}
