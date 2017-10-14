import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import models from '../models'

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
      name: submitUser.name,
      userName: submitUser.userName,
      email: submitUser.email,
      facebookId: null,
      password: submitUser.password,
      description: submitUser.description
    })
    await newUser.save()
    res.json(newUser).end()
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
    name: user.name,
    userName: user.userName,
    facebookId: user.facebookId,
    description: user.description
  }, secret, {
    expiresIn: '6h'
  })
  res.send(jwtoken).end()
}

export default {
  registerUser,
  login
}
