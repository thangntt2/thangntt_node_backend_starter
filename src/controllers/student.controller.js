import models from '../models'

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

export default {
  fetchAll,
  newStudent
}
