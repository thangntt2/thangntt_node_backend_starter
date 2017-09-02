export default (sequelize, DataTypes) => {
  var Admin = sequelize.define('Admin', {
    userName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  Admin.associate = (models) => {
    Admin.hasMany(models.AccessToken,
      {
        foreignKey: 'adminId',
        constraints: true,
        onDelete: 'cascade'
      })
  }
  return Admin
}
