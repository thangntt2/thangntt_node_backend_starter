import * as Controllers from './controllers'

const routerDefine = {
  studentList: Controllers.Student.fetchAll,
  sponsorList: Controllers.Sponsor.fetchAll,
  newStudent: Controllers.Student.newStudent,
  loginStudent: Controllers.Student.loginStudent,
  loginSponsor: Controllers.Sponsor.login,
  studentListEvent: Controllers.Student.listEvent,
  listAllEvents: Controllers.Event.fetchAll,
  studentUserInfo: Controllers.Student.userInfo,
  enrollStudentEvent: Controllers.Student.enrollEvent,
  cancelStudentEvent: Controllers.Student.cancelEvent,
  getEventInfo: Controllers.Event.getInfo,
  getSlotRemain: Controllers.Other.getSlotRemain,
  logoutStudent: Controllers.Student.logoutStudent,
  sponsorListEvent: Controllers.Sponsor.listEvent,
  createNewEventBySponsor: Controllers.Event.newEventBySponsor,
  logoutSponsor: Controllers.Sponsor.logoutSponsor,
  getListStudentJoinEvent: Controllers.Event.getStudent,
  editEvent: Controllers.Event.editEvent,
  deleteEvent: Controllers.Event.deleteEvent,
  cancelEvent: Controllers.Event.cancelEvent,
  getSponsorInfo: Controllers.Sponsor.getInfoById,
  getStudentInfo: Controllers.Student.getInfoById,
  setStudentStatus: Controllers.Student.setStudentStatus,
  getStudentByBarcode: Controllers.Student.getByBarcode,
  editStudentUserInfo: Controllers.Student.editStudentUserInfo,
  editStudentInfo: Controllers.Student.editStudentInfo,
  editSponsorInfo: Controllers.Sponsor.editSponsorInfo,
  editSponsorUserInfo: Controllers.Sponsor.editSponsorUserInfo,
  sponsorUserInfo: Controllers.Sponsor.getSponsorUserInfo,
  studentUserLogs: Controllers.Student.getStudentLogs,
  checkoutByBarcode: Controllers.Student.checkoutByBarcode,
  loginRoot: Controllers.Other.loginRoot,
  getStudentHistory: Controllers.Student.getStudentLogsById,
  uploadImage: Controllers.Other.uploadImage,
  getImage: Controllers.Other.getImage,
  createSponsor: Controllers.Sponsor.createSponsor,
  checkValidEmail: Controllers.Student.isValidEmail,
  changeStudentPassword: Controllers.Student.changePassword,
  getStatistic: Controllers.Other.getStatistic,
}

export default (app) => {
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
