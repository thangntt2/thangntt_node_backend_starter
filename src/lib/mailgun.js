import MailGun from 'mailgun.js'
import conf from '../conf'
import fs from 'fs'
import path from 'path'
import resetHTMLGenerate from '../resource/account_password_reset'

const logoWhitePath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/logo_white.png'))
const unlockedPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/unlocked.png'))
const socialFacebookPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/social-facebook.png'))
const twitterPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/social-twitter.png'))
const instaPath = fs.createReadStream(path.join(__dirname, '../resource/emailImage/social-instagram.png'))

const mailGunClient = MailGun.client({username: conf.MG_USERNAME, key: conf.MG_APIKEY})
export default (user, jwtoken) =>
  mailGunClient.messages.create(conf.MG_DOMAIN, {
    from: 'The Coin Admin <no-reply@minesilo.com>',
    to: [user.email],
    subject: 'Your reset password link',
    html: resetHTMLGenerate(`${conf.FRONT_END_URL}/resetpassword?token=${jwtoken}`),
    inline: [logoWhitePath, unlockedPath, socialFacebookPath, twitterPath, instaPath]
  }).then(msg => ({ msg }))
    .catch(error => ({ error }))
