import * as Controllers from './controllers'

const routerDefine = {
  // studentList: Controllers.Student.fetchAll
  // login: Controllers.User.login,
  // register: Controllers.User.registerUser
  test: (req, res) => {res.send('aaa')}
}

export default (app) => {
  /**
   * Other routes
   */
  app.post('/login', Controllers.User.login)
  app.post('/register', Controllers.User.registerUser)
  app.post('/resetpassword', Controllers.User.resetPassword)
  app.post('/changeLostPassword', Controllers.User.changeLostPassword)
  /**
   * Web socket routes
   */
  app.ws('/ws/stats', Controllers.Stats)
  app.get('/ws/stats', (req, res, next) => {
    res.send(req.dataCache.toObject()).end()
  })
  /**
   * Router handler
   */
  app.all('/api/*', (req, res, next) => {
    const operation = req.swagger.operation
    if (operation && operation.operationId && routerDefine[operation.operationId]) {
      console.log(`call to serve ${operation.operationId}`)
      return routerDefine[operation.operationId](req, res, next)
    } else {
      console.log(`missing handler with operationId: ${operation.operationId}`)
      res.status(500)
        .send('missing handler for current route')
        .end()
    }
  })

  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message &&
      (~err.message.indexOf('not found') ||
      (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next()
    }

    console.error(err.stack)

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', { error: err.stack })
      return
    }

    // error page
    res.status(500).render('500', { error: err.stack })
  })

  // assume 404 since no middleware responded
  app.use(function (req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found'
    }
    if (req.accepts('json')) return res.status(404).json(payload)
    res.status(404).render('404', payload)
  })
}
