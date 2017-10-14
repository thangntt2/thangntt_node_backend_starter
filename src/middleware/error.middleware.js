export default (app) => {
  app.use((err, req, res, next) => {
    console.log(err)
    res.status(400).send(err).end()
  })
}
