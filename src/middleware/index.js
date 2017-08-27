import applyAuth from './auth.middleware'
import errorHandler from './error.middleware'
import addSwaggerUi from './swaggerUI.middleware'

export default (app) => {
  applyAuth(app)
  addSwaggerUi(app)
  errorHandler(app)
}
