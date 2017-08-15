import models from '../models'

const fetchAll = async (req, res) => {
  const students = await models.Student.findAll({})
  res.send(students).status(200).end()
}

const newStudent = async (req, res) => {
  await models.Student.create({
    username: req.body.name
  })
  res.status(201).end()
}

export default {
  fetchAll,
  newStudent
}
