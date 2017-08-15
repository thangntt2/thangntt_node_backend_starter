// import passport from 'passport'
// import { Strategy as BearerStrategy } from 'passport-http-bearer'
// import mongoose from 'mongoose'
// import '../models/accessToken.model'

// const TokenDb = mongoose.model('Token')

// passport.use(new BearerStrategy(
//   async (token, done) => {
//     const tokenObj = await TokenDb.findOne({ token })
//     if (!tokenObj || tokenObj.accessTokenExpiresOn < Date.now()) {
//       return done(null, false)
//     }
//     return done(null, tokenObj, { scope: 'all' })
//   }
// ))

// export default (app) => {
//   app.all('/api/*', passport.authenticate('bearer', { session: false }))
// }
