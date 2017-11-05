
// import mongoose from 'mongoose'

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import middleware from 'swagger-express-middleware'
import applyMiddleware from './middleware'
import config from './conf'
import configRouter from './router'
import WebSocket from 'ws'
import Queue from './lib/Queue'

const sleep = (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

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

  // poll data from clients
  const dataCache = new Queue()
  const s = new WebSocket('ws://localhost:3001/')
  s.addEventListener('message', function (m) {
    const dataStr = m.data.toString()
    const data = JSON.parse(dataStr)
    for (let i = 0; i < data.length; i++) {
      dataCache.enqueue(data[i])
    }
    if (dataCache.getLength() >= config.DATA_CACHE_MAX_LENGTH) {
      for (let i = 0; i < (dataCache.getLength() - config.DATA_CACHE_MAX_LENGTH); i++) {
        dataCache.dequeue()
      }
    }
  })
  s.on('open', async () => {
    let timestamp = Date.now()
    while (true) {
      s.send('')
      const timeRemain = config.INTERVAL + timestamp - Date.now()
      await sleep(timeRemain)
      timestamp = Date.now()
    }
  })
  app.use('/ws/*', (req, res, next) => {
    req.dataCache = dataCache
    next()
  })
  applyMiddleware(app)
  const port = config.PORT || 3000
  configRouter(app)
  app.listen(port)
  console.log('Express app started on port ' + port)
})
