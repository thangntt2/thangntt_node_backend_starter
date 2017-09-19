import multer from 'multer'
import crypto from 'crypto'
import path from 'path'

const storage = multer.diskStorage({
  destination: '../tmp',
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return cb(err)

      return cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})
const upload = multer({ storage })

export default (app) => {
  app.all('/api/*', async (req, res, next))
}
