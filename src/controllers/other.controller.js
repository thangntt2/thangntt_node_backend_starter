import models from '../models'
import bcrypt from 'bcrypt'
import moment from 'moment'
import uuidv4 from 'uuid/v4'
import sequelize from 'sequelize'

const DATE_ONLY_FORMAT = 'YYYY-MM-DD'

const getSlotRemain = async (req, res) => {
  try {
    const student = await models.StudentLog.count({ where: {
      date: moment().format('YYYY-MM-DD'),
      time: { gt: moment().subtract(90, 'm') }
    },
      distinct: true, col: 'studentId' })
    res.json(student).end()
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
}

const getStatistic = async (req, res) => {
  try {
    const numberStudent = await models.Student.count({})
    console.log({ numberStudent })
    const numberStudentThisMonth = await models.Student.count({
      where: {
        joinDate: {
          $between: [moment().startOf('M').format(DATE_ONLY_FORMAT), moment().endOf('M').format(DATE_ONLY_FORMAT)],
        }
      }
    })
    console.log({ numberStudentThisMonth })
    const numberSponsor = await models.Sponsor.count({})
    const numberSponsorThisMonth = await models.Sponsor.count({
      where: {
        contactStartDate: {
          $between: [moment().startOf('M').format(DATE_ONLY_FORMAT), moment().endOf('M').format(DATE_ONLY_FORMAT)],
        }
      }
    })
    const numberEvent = await models.Event.count({
      where: {
        status: {
          $ne: 'draft'
        }
      }
    })
    const numberEventThisMonth = await models.Event.count({
      where: {
        date: {
          $between: [moment().startOf('M').format(DATE_ONLY_FORMAT), moment().endOf('M').format(DATE_ONLY_FORMAT)],
        },
        status: {
          $ne: 'draft'
        }
      }
    })
    const numberEventHeldThisMonth = await models.Event.count({
      where: {
        date: {
          $between: [moment().startOf('M').format(DATE_ONLY_FORMAT), moment().subtract(1, 'days').format(DATE_ONLY_FORMAT)],
        },
        status: {
          $ne: 'draft'
        }
      }
    })
    res.json({
      numberStudent,
      numberStudentThisMonth,
      numberSponsor,
      numberSponsorThisMonth,
      numberEvent,
      numberEventThisMonth,
      numberEventHeldThisMonth
    }).end()
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
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
  getImage,
  getStatistic
}
