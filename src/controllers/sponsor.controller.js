import models from '../models'
import bcrypt from 'bcrypt'
import uuidv4 from 'uuid/v4'

const fetchAll = async (req, res) => {
  const sponsors = await models.Sponsor.findAll({})
  res.send(sponsors).status(200).end()
}

const login = async (req, res) => {
  const email = req.query.username
  const password = req.query.password
  let sponsor = null
  try {
    sponsor = await models.sponsor.findOne({
      where: {
        email: email
      }
    })
  } catch (e) {
    res.status(404).end()
    return
  }

  const isMatch = await bcrypt.compare(password, sponsor.password)
  if (!isMatch) {
    res.status(401).end()
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
  res.json(accessToken).status(200).end()
}

const logoutSponsor = async (req, res) => {
  const sponsor = req.userInfo
  const accessToken = req.accessToken
  sponsor.removeAccessToken(accessToken)
  accessToken.destroy()
  res.status(200).send('Logout successfuly').end()
}

const listEvent = async (req, res) => {
  const sponsor = req.userInfo
  const events = await sponsor.getEvents()
  res.json(events).end()
}

const getInfoById = async (req, res) => {
  const sponsor = await models.Sponsor.findOne({ where: { id: req.pathParams.id } })
  res.json(sponsor).end()
}

export default {
  fetchAll,
  login,
  listEvent,
  logoutSponsor,
  getInfoById
}
