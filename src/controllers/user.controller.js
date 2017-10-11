import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import models from '../models'

const secret = '4d808924-2b7d-46be-9f8d-069834842f80'

const registerUser = async (req, res) => {
  try {
    const user = await models.User.find({ where: { email: req.body.email } })
    if (!user) {
      res.status(401).send('Email or password not match! 1').end()
      return
    }
    const isMatchPw = bcrypt.compareSync(req.body.password, user.password)
    if (!isMatchPw) {
      res.status(401).send('Email or password not match!').end()
      return
    }
    const jwtoken = jwt.sign({
      email: user.email,
      name: user.name,
      userType: user.userType
    }, secret, {
      expiresIn: '6h'
    })
    res.send(jwtoken).end()
  } catch (err) {
    console.log(err)
    res.status(500).end()
  }
}

const login = async (req, res) => {
  const user = await models.User.find({ where: { userName: req.body.userName } })
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
    name: user.name,
    userName: user.userName,
    facebookId: user.facebookId
  }, secret, {
    expiresIn: '6h'
  })
  res.send(jwtoken).end()
}

export default {
  registerUser,
  login
}
