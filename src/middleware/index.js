import applyAuth from './auth.middleware'
import errorHandler from './error.middleware'

export default (app) => {
  applyAuth(app)
  errorHandler(app)
}
