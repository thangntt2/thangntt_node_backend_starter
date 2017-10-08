import models from '../models'
import bcrypt from 'bcrypt'
import uuidv4 from 'uuid/v4'
import moment from 'moment'
import sequelize from 'sequelize'

const DATE_ONLY_FORMAT = 'YYYY-MM-DD'

const fetchAll = async (req, res) => {
  const { limit, offset, search, sort, sortOrder } = req.query
  const total = await models.Sponsor.count({
    where: sequelize.and(
      search && sequelize.literal(
        `companyName LIKE '%${search}%'`
      )
    )
  })
  const sponsors = await models.Sponsor.findAll({
    limit,
    offset,
    where: sequelize.and(
      search && sequelize.literal(
        `companyName LIKE '%${search}%'`
      )
    ),
    order: sort && sortOrder && [[sort, sortOrder]]
  })
  res.send({
    total,
    offset,
    results: sponsors
  }).status(200).end()
}

const login = async (req, res) => {
  const email = req.query.username
  const password = req.query.password
  let sponsor = null
  sponsor = await models.Sponsor.findOne({
    where: {
      email: email
    }
  })
  if (!sponsor) {
    res.status(401).send('bad email or password').end()
    return
  }

  const isMatch = await bcrypt.compare(password, sponsor.password)
  if (!isMatch) {
    res.status(401).send('bad email or password').end()
    return
  }

  const accessToken = await models.AccessToken.create({
    accessToken: uuidv4(),
    expiredTime: Date.now() + 6 * 3600 * 1000,
    userType: 'sponsor'
  }, {
    include: [models.Sponsor]
  })
  sponsor.addAccessToken(accessToken)
  res.json({
    ...accessToken.toJSON(),
    profile: sponsor
  }).status(200).end()
}

const logoutSponsor = async (req, res) => {
  const sponsor = req.userInfo
  const accessToken = req.accessToken
  sponsor.removeAccessToken(accessToken)
  accessToken.destroy()
  res.status(200).send('Logout successfuly').end()
}

const listEvent = async (req, res) => {
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
  const sponsor = req.userInfo
  const events = await sponsor.getEvents({
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
  res.json(events).end()
}

const getInfoById = async (req, res) => {
  const sponsor = await models.Sponsor.findOne({ where: { id: req.pathParams.id } })
  res.json(sponsor).end()
}

const getSponsorUserInfo = async (req, res) => {
  const sponsor = req.userInfo
  res.json(sponsor).end()
}

const editSponsorUserInfo = async (req, res) => {
  const sponsor = req.userInfo
  await sponsor.update({
    ...req.body
  })
  res.json(sponsor).end()
}

const editSponsorInfo = async (req, res) => {
  const sponsorInfo = await models.Sponsor.findOne({ where: { id: req.pathParams.id } })
  await sponsorInfo.update({
    ...req.body
  })
  res.json(sponsorInfo).end()
}

const createSponsor = async (req, res) => {
  const sponsor = await models.Sponsor.create({
    ...req.body
  })
  res.json(sponsor).end()
}

export default {
  fetchAll,
  login,
  listEvent,
  logoutSponsor,
  getInfoById,
  getSponsorUserInfo,
  editSponsorInfo,
  editSponsorUserInfo,
  createSponsor
}
