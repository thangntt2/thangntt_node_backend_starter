// import passport from 'passport'
// import { Strategy as BearerStrategy } from 'passport-http-bearer'
// import models from '../models'
// passport.use(new BearerStrategy(
//   async (token, done) => {
//     const tokenObjs = await models.AccessToken.findAll({
//       where: { accessToken: token }
//     })
//     if (!tokenObjs || !tokenObjs.length() || tokenObjs[0].accessTokenExpiresOn < Date.now()) {
//       return done(null, false)
//     }
//     return done(null, tokenObjs[0], { scope: 'all' })
//   }
// ))

export default (app) => {
  // app.all('/api/*', passport.authenticate('bearer', { session: false }))
  app.all('/api/*', (req, res, next) => {
    console.log(req.headers)
    if (req.headers['admin-api-key']) {
      console.log('A request from admin user')
      console.log(req.swagger)
      req.userInfo = { name: 'admin' }
      return next()
    } else if (req.headers['student-api-key']) {
      console.log('A request from student user')
      req.userInfo = { name: 'student' }
      return next()
    } else if (req.headers['sponsor-api-key']) {
      console.log('A request from sponsor user')
      req.userInfo = { name: 'sponsor' }
      return next()
    }
    // res.status(401).end()
    return next()
  })
}
