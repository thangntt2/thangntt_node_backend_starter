import bcrypt from 'bcrypt'

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    password: DataTypes.STRING,
    description: DataTypes.STRING
  })
  User.beforeCreate((user) => {
    user.password = bcrypt.hashSync(user.password, 10)
  })
  return User
}
  