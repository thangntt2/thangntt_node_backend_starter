import passport from 'passport'
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
// const FacebookStrategy = require('passport-facebook').Strategy

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = '4d808924-2b7d-46be-9f8d-069834842f80'
opts.authScheme = 'jwt'

// const FACEBOOK_APP_ID = 'abc'
// const FACEBOOK_APP_SECRET = 'def'

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
  const user = jwtPayload.user
  console.log(jwtPayload)
  if (!user) {
    done(new Error('invalid user'))
  }
  done(null, user)
}))

// passport.use(new FacebookStrategy({
//   clientID: FACEBOOK_APP_ID,
//   clientSecret: FACEBOOK_APP_SECRET,
//   callbackURL: 'http://localhost:3000/auth/facebook/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//   const user = await User.findOne({ facebookId: profile.id }).exec()
//   if (!user) {
//     done(new Error('invalid user'))
//   }
//   done(null, user)
// }))

export default (app) => {
  app.use('/api', passport.authenticate('jwt', { session: false }))
}
