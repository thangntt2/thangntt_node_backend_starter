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
  const sponsor = await models.Sponsor.findOne({
    where: {
      email: email
    }
  })
  if (!sponsor) {
    res.status(404).end()
    return
  }

  const isMatch = await bcrypt.compare(password, sponsor.password)
  if (!isMatch) {
    res.status(401).end()
  }

  const accessToken = await models.AccessToken.create({
    accessToken: uuidv4(),
    expiredTime: Date.now() + 6 * 3600 * 1000,
    userType: 'sponsor',
    sponsorId: sponsor.id
  }, {
    include: [models.Sponsor]
  })
  res.json(accessToken).status(200).end()
}

export default {
  fetchAll,
  login
}
