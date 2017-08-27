import swaggerUi from 'swagger-ui-express'
import config from '../conf'

export default (app) => {
  const options = {
    host: config.host
  }
  app.use('/ui', swaggerUi.serve, swaggerUi.setup(null, null, options, null, null, `${config.host}/api-docs`))
}
