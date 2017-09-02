import uuidv4 from 'uuid/v4'
import bcrypt from 'bcrypt'
import models from '../models'

const saltRounds = 10

const fetchAll = async (req, res) => {
  const students = await models.Student.findAll({})
  res.send(students).status(200).end()
}

const newStudent = async (req, res) => {
  await models.Student.create({
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
  res.status(201).end()
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
    userType: 'student',
    studentId: student.id
  }, {
    include: [models.Student]
  })
  res.json(accessToken).status(200).end()
}

const listEvent = async (req, res) => {
  const studentInfo = req.userInfo
  const events = await studentInfo.getEvents()
  res.json(events).status(200).end()
}

export default {
  fetchAll,
  newStudent,
  loginStudent,
  listEvent
}
