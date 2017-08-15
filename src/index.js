
// import mongoose from 'mongoose'

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
// import applyMiddleware from './middleware'
import config from './conf'

// const options = { useMongoClient: true, keepAlive: 1  };
// mongoose.Promise = require('bluebird');
// mongoose.connect(config.MONGODB_URI, options);

console.log(config)
const app = express()
app.use(cors())
app.use(bodyParser.json())

// applyMiddleware(app)

app.get('/status', (req, res) => {
  res.send({"OK": true}, 200)
})

import config_router from './router'

config_router(app)

app.listen(config.PORT);
console.log('Express app started on port ' + config.PORT);