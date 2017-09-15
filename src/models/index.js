import Sequelize from 'sequelize'

import Student from './student.model'
import BnCEvent from './event.model'
import AccessToken from './accessToken.model'
import Sponsor from './sponsor.model'
import StudentEvents from './studentEvents.model'
import Admin from './admin.model'
import StudentLog from './studentLog.model'
import config from '../conf'

export const sequelize = new Sequelize(config.MYSQL_DB, config.MYSQL_USER, config.MYSQL_PASSWORD, {
  host: config.MYSQL_HOST,
  dialect: 'mysql'
}, {
  define: {charset: 'utf8mb4', collate: 'utf8mb4_bin'}
})

const models = {}

const modules = [
  AccessToken,
  Student,
  BnCEvent,
  Sponsor,
  StudentEvents,
  StudentLog,
  Admin
]

// Initialize models
modules.forEach(module => {
  const model = module(sequelize, Sequelize)
  models[model.name] = model
})

// Apply associations
Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models)
    models[key].sync()
  }
})

export default models
