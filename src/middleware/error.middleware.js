export default (app) => {
  app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send(err).end()
  })
}
