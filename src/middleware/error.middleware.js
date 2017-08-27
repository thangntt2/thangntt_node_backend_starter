export default (app) => {
  app.use((err, req, res, next) => {
    res.status(err.status).send(err.message).end()
  })
}
