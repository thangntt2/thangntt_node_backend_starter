import path from 'path'
export default {
  MYSQL_DB: 'crypto',
  MYSQL_USER: 'root',
  MYSQL_PASSWORD: 'root',
  MYSQL_HOST: 'localhost',
  PORT: 3000,
  appRoot: path.join(__dirname, '../'),
  swaggerFile: path.join(__dirname, '../api/swagger/swagger.yaml'),
  swaggerFileUrl: '/swagger',
  MG_USERNAME: 'api',
  MG_DOMAIN: 'mail.minesilo.com',
  MG_APIKEY: 'key-29d2cf4298c31e735a18a9320ab3a29e',
  host: 'http://18.221.129.89:3000',
  FRONT_END_URL: 'http://minesilo.com',
  JWT_SECRET: '4d808924-2b7d-46be-9f8d-069834842f80'
}
