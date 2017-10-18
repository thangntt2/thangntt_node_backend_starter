import uuidv4 from 'uuid/v4'
import moment from 'moment'
import sequelize from 'sequelize'
import bcrypt from 'bcrypt'
import models from '../models'

const DATE_ONLY_FORMAT = 'YYYY-MM-DD'

const fetchAll = async (req, res) => {
  const { limit, offset, search, sort, sortOrder } = req.query
  const total = await models.Student.count({
    where: sequelize.and(
      search && sequelize.literal(
        `(CONCAT(familyName, giveName) LIKE '%${search}%')`
      )
    )
  })
  const students = await models.Student.findAll({
    limit,
    offset,
    where: sequelize.and(
      search && sequelize.literal(
        `(CONCAT(familyName, giveName) LIKE '%${search}%')`
      )
    ),
    order: sort && sortOrder && [[sort, sortOrder]]
  })
  res.send({
    total,
    offset,
    results: students
  }).status(200).end()
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}

const editStudentUserInfo = async (req, res) => {
  const studentInfo = req.userInfo
  await studentInfo.update({
    ...req.body
  })
  res.status(200).json(studentInfo).end()
}

const editStudentInfo = async (req, res) => {
  const { id } = req.pathParams
  const studentInfo = await models.Student.findOne({ where: { id } })
  await studentInfo.update({
    ...req.body
  })
  res.status(200).json(studentInfo).end()
}

const newStudent = async (req, res) => {
  const student = await models.Student.create({
    familyName: req.body.familyName,
    giveName: req.body.giveName,
    email: req.body.email,
    admissionYear: req.body.admissionYear,
    department: req.body.department,
    dateOfBirth: req.body.dateOfBirth,
    sex: req.body.sex,
    password: req.body.password,
    studentCard: req.body.studentCard,
    profileImage: req.body.profileImage,
    studentNumber: req.body.studentNumber,
    joinDate: moment().format('YYYY-MM-DD'),
    deadline: moment().add(30, 'days').format('YYYY-MM-DD'),
    remark: '',
    barcode: getRandomInt(1000000000000, 1999999999999),
    status: 'under_review',
    address: req.body.address,
    phoneNumber: req.body.phoneNumber
  })
  res.status(201).json(student).end()
}

const loginStudent = async (req, res) => {
  const email = req.query.username
  const password = req.query.password
  const student = await models.Student.findOne({
    where: {
      email: email
    }
  })
  if (!student || student.status !== 'member') {
    res.status(401).send('Invalidate student email or password').end()
    return
  }

  const isMatch = await bcrypt.compare(password, student.password)
  if (!isMatch) {
    res.status(401).send('Invalidate student email or password').end()
  }

  const accessToken = await models.AccessToken.create({
    accessToken: uuidv4(),
    expiredTime: Date.now() + 6 * 3600 * 1000,
    userType: 'student'
  }, {
    include: [models.Student]
  })
  student.addAccessToken(accessToken)
  res.json(accessToken).status(200).end()
}

const logoutStudent = async (req, res) => {
  const student = req.userInfo
  const accessToken = req.accessToken
  student.removeAccessToken(accessToken)
  accessToken.destroy()
  res.status(200).send('Logout successfuly').end()
}

const listEvent = async (req, res) => {
  // const studentInfo = req.userInfo
  // const events = await studentInfo.getEvents()
  // res.json(events).status(200).end()
  const { limit, offset, timeRange, search, sort, sortOrder } = req.query
  const critical = {}
  if (timeRange) {
    if (timeRange.length === 2) {
      critical.date = {
        $between: [moment(timeRange[0]).format(DATE_ONLY_FORMAT), moment(timeRange[1]).format(DATE_ONLY_FORMAT)]
      }
    } else {
      critical.date = moment(timeRange[0]).format(DATE_ONLY_FORMAT)
    }
  }
  console.log(critical)
  const studentInfo = req.userInfo
  const events = await studentInfo.getEvents({
    limit,
    offset,
    where: sequelize.and(
      critical,
      search && sequelize.literal(
        `MATCH(eventTitle, description) AGAINST("${search}")`
      )
    ),
    order: sort && sortOrder && [[sort, sortOrder]]
  })
  res.json(events).status(200).end()
}

const userInfo = async (req, res) => {
  res.json(req.userInfo).status(200).end()
}

const enrollEvent = async (req, res) => {
  // req.query.eventId
  const event = await models.Event.findOne({ where: { id: req.query.eventId } })
  const student = req.userInfo
  await student.addEvent(event)
  // await event.addStudent(student)
  res.status(200).send('Successful enroll to event').end()
}

const cancelEvent = async (req, res) => {
  const event = await models.Event.findOne({ where: { id: req.query.eventId } })
  const student = req.userInfo
  await student.removeEvent(event)
  await event.removeStudent(student)
  res.status(200).send('Successfull cancel event').end()
}

const getInfoById = async (req, res) => {
  const student = await models.Student.findOne({ where: { id: req.pathParams.id } })
  res.json(student).end()
}

const setStudentStatus = async (req, res) => {
  const student = await models.Student.findOne({ where: { id: req.pathParams.id } })
  await student.update({
    status: req.body.status
  })
  res.json(student).end()
}

const getByBarcode = async (req, res) => {
  const student = await models.Student.findOne({ where: { barcode: req.pathParams.barcode } })
  res.json(student).status(200).end()
}

const checkoutByBarcode = async (req, res) => {
  const student = await models.Student.findOne({ where: { barcode: req.query.barcode } })
  if (!student) {
    res.status(404).send('Cannot find student with given barcode').end()
    return
  }
  const log = await models.StudentLog.create({
    date: moment().format('YYYY-MM-DD'),
    time: moment().format()
  })
  await student.addStudentLog(log)
  res.json(log).status(200).end()
}

const getStudentLogs = async (req, res) => {
  const student = req.userInfo
  const logs = await student.getStudentLogs()
  res.json({ logs, score: logs.length }).end()
}

const getStudentLogsById = async (req, res) => {
  const student = await models.Student.findOne({ where: { id: req.pathParams.id } })
  const logs = await student.getStudentLogs()
  res.json({ logs, score: logs.length }).end()
}

const isValidEmail = async (req, res) => {
  const student = await models.Student.findOne({ where: { email: req.query.email } })
  res.send(student ? 'valid' : 'invalid').end()
}

const changePassword = async (req, res) => {
  const student = await models.Student.findOne({ where: { email: req.query.email } })
  await student.update({
    password: req.query.password
  })
  res.status(200).send('success').end()
}

export default {
  fetchAll,
  newStudent,
  loginStudent,
  listEvent,
  userInfo,
  enrollEvent,
  cancelEvent,
  logoutStudent,
  getInfoById,
  setStudentStatus,
  getByBarcode,
  editStudentInfo,
  editStudentUserInfo,
  getStudentLogs,
  checkoutByBarcode,
  getStudentLogsById,
  isValidEmail,
  changePassword
}
