import models from '../models'
import bcrypt from 'bcrypt'
import uuidv4 from 'uuid/v4'

const getSlotRemain = async (req, res) => {
  res.json(200).end()
}

const loginRoot = async (req, res) => {
  const email = req.query.username
  const password = req.query.password
  let admin = null
  admin = await models.Admin.findOne({
    where: {
      userName: email
    }
  })
  if (!admin) {
    res.status(401).send('bad username or password').end()
    return
  }
  const isMatch = await bcrypt.compare(password, admin.password)
  if (!isMatch) {
    res.status(401).send('bad username or password').end()
    return
  }

  const accessToken = await models.AccessToken.create({
    accessToken: uuidv4(),
    expiredTime: Date.now() + 6 * 3600 * 1000,
    userType: 'admin'
  }, {
    include: [models.Admin]
  })
  admin.addAccessToken(accessToken)
  res.json(accessToken).status(200).end()
}

const uploadImage = async (req, res) => {
  res.status(200).json({imageUrl: `/api/image/${req.files.image.filename}`}).end()
}

export const getImage = (req, res) => {
  const options = {
    root: './tmp',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
      'Content-Type': 'image/png'
    }
  }
  res.sendFile(req.pathParams.imageId, options)
}

export default {
  getSlotRemain,
  loginRoot,
  uploadImage,
  getImage
}
