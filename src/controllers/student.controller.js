import uuidv4 from 'uuid/v4'
import bcrypt from 'bcrypt'
import models from '../models'

const saltRounds = 10

const fetchAll = async (req, res) => {
  const students = await models.Student.findAll({})
  res.send(students).status(200).end()
}

const newStudent = async (req, res) => {
  const student = await models.Student.create({
    name: req.body.name,
    email: req.body.email,
    admissionYear: req.body.admissionYear,
    department: req.body.department,
    dateOfBirth: req.body.dateOfBirth,
    sex: req.body.sex,
    password: await bcrypt.hash(req.body.password, saltRounds),
    studentCard: req.body.studentCard,
    image: req.body.image,
    studentNumber: req.body.studentNumber,
    barcode: '123456789',
    status: 'under_review'
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
  if (!student) {
    res.status(404).end()
    return
  }

  const isMatch = await bcrypt.compare(password, student.password)
  if (!isMatch) {
    res.status(401).end()
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
  const studentInfo = req.userInfo
  const events = await studentInfo.getEvents()
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
  await event.addStudent(student)
  res.status(200).send('Successful enroll to event').end()
}

const cancelEvent = async (req, res) => {
  const event = await models.Event.findOne({ where: { id: req.query.eventId } })
  const student = req.userInfo
  await student.removeEvent(event)
  await event.removeStudent(student)
  res.status(200).send('Successfull cancel event').end()
}

export default {
  fetchAll,
  newStudent,
  loginStudent,
  listEvent,
  userInfo,
  enrollEvent,
  cancelEvent,
  logoutStudent
}
