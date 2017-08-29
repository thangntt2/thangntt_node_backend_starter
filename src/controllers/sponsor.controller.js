import models from '../models'

const fetchAll = async (req, res) => {
  const sponsors = await models.Sponsor.findAll({})
  res.send(sponsors).status(200).end()
}

export default {
  fetchAll,
}
