import models from '../models'

export default (app) => {
  // app.all('/api/*', passport.authenticate('bearer', { session: false }))
  app.all('/api/*', async (req, res, next) => {
    console.log(req.headers)
    if (req.headers['admin-api-key']) {
      console.log('A request from admin user')
      if (req.headers['admin-api-key'] === 'thangntt') {
        req.userInfo = await models.Admin.findOne({ where: { id: 1 } })
        return next()
      }
      const accessToken = await models.AccessToken.findOne({ where: { accessToken: req.headers['admin-api-key'] } })
      if (accessToken && accessToken.get('expiredTime') > Date.now()) {
        req.userInfo = await models.Admin.findOne({ where: { id: accessToken.get('adminId') } })
        req.accessToken = accessToken
        return next()
      } else {
        res.status(401).end()
      }
    } else if (req.headers['student-api-key']) {
      console.log('A request from student user')
      if (req.headers['student-api-key'] === 'thangntt') {
        req.userInfo = await models.Student.findOne({ where: { id: 1 } })
        return next()
      }
      const accessToken = await models.AccessToken.findOne({ where: { accessToken: req.headers['student-api-key'] } })
      if (accessToken && accessToken.get('expiredTime') > Date.now()) {
        const studentInfo = await models.Student.findOne({ where: { id: accessToken.get('studentId') } })
        req.userInfo = studentInfo
        req.accessToken = accessToken
        return next()
      } else {
        res.status(401).end()
      }
    } else if (req.headers['sponsor-api-key']) {
      console.log('A request from sponsor user')
      if (req.headers['sponsor-api-key'] === 'thangntt') {
        req.userInfo = await models.Sponsor.findOne({ where: { id: 1 } })
        return next()
      }
      const accessToken = await models.AccessToken.findOne({ where: { accessToken: req.headers['sponsor-api-key'] } })
      if (accessToken && accessToken.expiredTime > Date.now()) {
        req.userInfo = await models.Sponsor.findOne({ where: { id: accessToken.sponsorId } })
        req.accessToken = accessToken
        return next()
      } else {
        res.status(401).end()
      }
    }
    // res.status(401).end()
    return next()
  })
}
