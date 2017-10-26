import bcrypt from 'bcrypt'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import MailGun from 'mailgun.js'
import path from 'path'
import models from '../models'
import resetHTMLGenerate from '../resource/account_password_reset'

const logoWhitePath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/logo_white.png'))
const unlockedPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/unlocked.png'))
const socialFacebookPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/social-facebook.png'))
const twitterPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/social-twitter.png'))
const instaPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/social-instagram.png'))

const MG_USERNAME = 'api'
const MG_DOMAIN = 'mail.minesilo.com'
const MG_APIKEY = 'key-29d2cf4298c31e735a18a9320ab3a29e'
const mailGunClient = MailGun.client({username: MG_USERNAME, key: process.env.MAILGUN_API_KEY || MG_APIKEY})

const secret = '4d808924-2b7d-46be-9f8d-069834842f80'

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
    }, secret, {
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
  }, secret, {
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
  }, secret, {
    expiresIn: '6h'
  })
  const { msg, error } = await mailGunClient.messages.create(MG_DOMAIN, {
    from: 'The Coin Admin <no-reply@minesilo.com>',
    to: [user.email],
    subject: 'Your reset password link',
    html: resetHTMLGenerate(`http://localhost:8080/resetpassword?token=${jwtoken}`),
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
  if (await jwt.verify(token, secret)) {
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
