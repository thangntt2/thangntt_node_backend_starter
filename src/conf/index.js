switch (process.env.NODE_ENV) {
  case 'development':
    module.exports = require('./dev')
    break
  case 'staging':
    module.exports = require('./staging')
    break
  case 'production':
    module.exports = require('./prod')
    break
  default:
    console.error('Unrecognized NODE_ENV: ' + process.env.NODE_ENV)
    process.exit(1)
}
