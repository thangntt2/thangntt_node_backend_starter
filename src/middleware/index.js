
import applyAuth from './auth.middleware'
import errorHandler from './error.middleware'
import addSwaggerUi from './swaggerUI.middleware'
// import multer from 'multer'
// const upload = multer({dest: './tmp'})

export default (app) => {
  applyAuth(app)
  addSwaggerUi(app)
  errorHandler(app)
}
