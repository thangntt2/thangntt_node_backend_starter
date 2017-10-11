import bcrypt from 'bcrypt'

export default (sequelize, DataTypes) => {
    const User = sequelize.define('Use', {
      name: DataTypes.STRING,
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      facebookId: DataTypes.STRING,
      password: DataTypes.STRING,
      description: DataTypes.STRING
    }, {
      hooks: {
        beforeSave: (instance, options) => {
          instance.password = bcrypt.hashSync(instance.password)
        }
      }
    })
    return User
  }
  