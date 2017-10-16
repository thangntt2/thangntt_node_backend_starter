import path from 'path'
export default {
  MYSQL_DB: 'blayncafe',
  MYSQL_USER: 'root',
  MYSQL_PASSWORD: '',
  MYSQL_HOST: 'localhost',
  PORT: 3000,
  appRoot: path.join(__dirname, '../'),
  swaggerFile: path.join(__dirname, '../api/swagger/swagger.yaml'),
  swaggerFileUrl: '/swagger',
  host: 'http://localhost:3000'
}
