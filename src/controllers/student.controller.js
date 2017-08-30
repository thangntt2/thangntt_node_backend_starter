import models from '../models'
const uuidv4 = require('uuid/v4')

const fetchAll = async (req, res) => {
  const students = await models.Student.findAll({})
  res.send(students).status(200).end()
}

const newStudent = async (req, res) => {
  await models.Student.create({
    firstName: "vu",
    lastName: "cuong",
    email: req.body.email,
    admissionYear: req.body.admissionYear,
    department: req.body.department,
    dateOfBirth: req.body.dateOfBirth,
    sex: "male",
    password: req.body.password,
    studentCard: req.body.studentCard,
    image: req.body.image,
    studentNumber: req.body.studentNumber,
    barcode: "123456789",
    status: "member",
  })
  res.status(201).end()
}

const loginStudent = async (req, res) => {
  var email = req.query.username
  var password = req.query.password
   await models.Student.findOne({
    where: {
      email: email,
      password: password
    }
  }).then(user => {
      if(!user){
        res.status(404).end()
      }

      const access = models.AccessToken.create({
        accessToken: uuidv4(),
        expiredTime: Date.now() + 6 * 3600 *1000,
        userType: "student",
        studentId: user.id,
      })
      res.send("ok").status(200).end()
    })
}
export default {
  fetchAll,
  newStudent,
  loginStudent
}
