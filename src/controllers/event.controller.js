import moment from 'moment'
import sequelize from 'sequelize'
import models from '../models'

const DATE_ONLY_FORMAT = 'YYYY-MM-DD'

const fetchAll = async (req, res) => {
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
  critical.status = {
    $ne: 'draft'
  }
  const events = await models.Event.findAll({
    limit,
    offset,
    where: sequelize.and(
      critical,
      search && sequelize.literal(
        `MATCH(eventTitle, description) AGAINST("${search}")`
      ),
    ),
    order: sort && sortOrder && [[sort, sortOrder]]
  })
  res.json(events).end()
}

const getInfo = async (req, res) => {
  const event = await models.Event.findOne({ where: { id: req.pathParams.id } })
  res.json(event).end()
}

const newEventBySponsor = async (req, res) => {
  const submitEvent = req.body
  const sponsor = req.userInfo
  const event = await models.Event.create({
    ...submitEvent
  }, {
    include: [models.Sponsor]
  })
  sponsor.addEvent(event)
  res.status(201).json(event).end()
}

const getStudent = async (req, res) => {
  const event = await models.Event.findOne({ where: { id: req.pathParams.id } })
  const students = await event.getStudents()
  return res.status(200).json(students).end()
}

const editEvent = async (req, res) => {
  const event = await models.Event.findOne({ where: { id: req.pathParams.id } })
  const newEventInfo = req.body
  await event.update({
    ...newEventInfo
  })
  return res.status(200).json(event).end()
}

const deleteEvent = async (req, res) => {
  const event = await models.Event.findOne({ where: { id: req.pathParams.id } })
  const sponsor = await event.getSponsor()
  sponsor.removeEvent(event)
  await event.destroy()
  res.status(200).send('Successful detele event').end()
}

const cancelEvent = async (req, res) => {
  const event = await models.Event.findOne({ where: { id: req.pathParams.eventId } })
  await event.update({
    status: 'cancel'
  })
  return res.status(200).send('Successful cancel event').end()
}

export default {
  fetchAll,
  getInfo,
  newEventBySponsor,
  getStudent,
  editEvent,
  deleteEvent,
  cancelEvent
}
