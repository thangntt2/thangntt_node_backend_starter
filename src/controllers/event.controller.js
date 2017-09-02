import models from '../models'

const fetchAll = async (req, res) => {
  const events = await models.Event.findAll({})
  res.json(events).end()
}

const getInfo = async (req, res) => {
  const event = await models.Event.findOne({ where: { id: req.pathParams.id } })
  res.json(event).end()
}

export default {
  fetchAll,
  getInfo
}
