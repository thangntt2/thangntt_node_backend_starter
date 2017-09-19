
// import mongoose from 'mongoose'

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import middleware from 'swagger-express-middleware'
import applyMiddleware from './middleware'
import config from './conf'
import configRouter from './router'
import multer from 'multer'
const upload = multer({dest: './tmp'})
// const options = { useMongoClient: true, keepAlive: 1  };
// mongoose.Promise = require('bluebird');
// mongoose.connect(config.MONGODB_URI, options);

console.log(config)
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/status', (req, res) => {
  res.send({'OK': true}, 200)
})

app.use(upload.fields([{name: 'image'}]))

middleware(config.swaggerFile, app, (err, middleware) => {
  if (err) { throw err }
  // Add all the Swagger Express Middleware, or just the ones you need.
  // NOTE: Some of these accept optional options (omitted here for brevity)
  app.use(
      middleware.metadata(),
      middleware.CORS(),
      middleware.files({
        rawFilesPath: config.swaggerFileUrl
      }),
      middleware.parseRequest(),
      middleware.validateRequest()
      // middleware.mock()
  )

  applyMiddleware(app)

  const port = config.PORT || 3000
  configRouter(app)
  app.listen(port)
  console.log('Express app started on port ' + config.PORT)
})
