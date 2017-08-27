import swaggerUi from 'swagger-ui-express'

export default (app) => {
  app.use('/ui', swaggerUi.serve, swaggerUi.setup(null, null, null, null, null, 'http://localhost:3000/api-docs'))
}
