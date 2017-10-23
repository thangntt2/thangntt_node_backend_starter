import bcrypt from 'bcrypt'

const saltRounds = 7

const hashPassword = async (user, options) => {
  user.password = await bcrypt.hashSync(user.password, saltRounds)
}

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    password: DataTypes.STRING,
  })
  User.beforeCreate(hashPassword)
  User.beforeUpdate(hashPassword)
  return User
}
  