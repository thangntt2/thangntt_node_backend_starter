import bcrypt from 'bcrypt'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import MailGun from 'mailgun.js'
import path from 'path'
import conf from '../conf'
import models from '../models'
import resetHTMLGenerate from '../resource/account_password_reset'

const logoWhitePath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/logo_white.png'))
const unlockedPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/unlocked.png'))
const socialFacebookPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/social-facebook.png'))
const twitterPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/social-twitter.png'))
const instaPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/social-instagram.png'))

const registerUser = async (req, res) => {
  const submitUser = req.body
  try {
    const checkUser = await models.User.find({ where: { email: submitUser.email } })
    if (checkUser) {
      res.status(400).send('Not a valid user').end()
      return
    }
    const newUser = await models.User.create({
      firstName: submitUser.firstName,
      lastName: submitUser.lastName,
      userName: submitUser.username,
      email: submitUser.email,
      facebookId: null,
      password: submitUser.password
    })
    const jwtoken = jwt.sign({
      email: newUser.email,
      facebookId: newUser.facebookId,
      userName: newUser.userName
    }, conf.JWT_SECRET, {
      expiresIn: '6h'
    })
    res.json(jwtoken).end()
  } catch (err) {
    console.log(err)
    res.status(500).send(err).end()
  }
}

const login = async (req, res) => {
  console.log(req.body)
  const user = req.body.userName
    ? await models.User.find({ where: { userName: req.body.userName } })
    : await models.User.find({ where: { email: req.body.email } })
  if (!user) {
    res.status(401).send('Invalid username').end()
    return
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    res.status(401).send('Invalid password').end()
    return
  }
  const jwtoken = jwt.sign({
    email: user.email,
    facebookId: user.facebookId,
    userName: user.userName
  }, conf.JWT_SECRET, {
    expiresIn: '6h'
  })
  res.send(jwtoken).end()
}

const resetPassword = async (req, res) => {
  const email = req.body.email
  const user = await models.User.findOne({ where: { email } })
  if (!user) {
    res.status(404).send('Cannot find this email').end()
    return
  }
  const jwtoken = jwt.sign({
    email: user.email,
    facebookId: user.facebookId,
    userName: user.userName
  }, conf.JWT_SECRET, {
    expiresIn: '6h'
  })
  const mailGunClient = MailGun.client({username: conf.MG_USERNAME, key: conf.MG_APIKEY})
  const { msg, error } = await mailGunClient.messages.create(conf.MG_DOMAIN, {
    from: 'The Coin Admin <no-reply@minesilo.com>',
    to: [user.email],
    subject: 'Your reset password link',
    html: resetHTMLGenerate(`${conf.FRONT_END_URL}/resetpassword?token=${jwtoken}`),
    inline: [logoWhitePath, unlockedPath, socialFacebookPath, twitterPath, instaPath]
  }).then(msg => ({ msg }))
    .catch(error => ({ error }))
  if (!error) {
    res.status(200).end()
  } else {
    console.log(error)
    res.status(500).end()
  }
}

const changeLostPassword = async (req, res) => {
  const { password, token } = req.body
  if (await jwt.verify(token, conf.JWT_SECRET)) {
    const userData = await jwt.decode(token)
    const user = await models.User.findOne({ where: { email: userData.email } })
    if (!user) {
      res.status(400).send('No email').end()
      return
    }
    await user.update({
      password
    })
    res.status(200).send('Successful reset password').end()
  }
}

export default {
  registerUser,
  login,
  resetPassword,
  changeLostPassword
}
