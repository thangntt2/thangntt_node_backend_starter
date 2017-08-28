import path from 'path'
export default {
  MYSQL_DB: 'bayncafe',
  MYSQL_USER: 'bayncafe',
  MYSQL_PASSWORD: '123456',
  MYSQL_HOST: 'localhost',
  PORT: 3000,
  appRoot: path.join(__dirname, '../'),
  swaggerFile: path.join(__dirname, '../api/swagger/swagger.yaml'),
  swaggerFileUrl: '/swagger',
  host: 'http://localhost:3000'
}
