# Blayncafe project setup guide
## 1. Setup API server
### Setup enviroment
- Install Mysql

```sudo apt-get install mysql```
- Setup Project enviroment:

Edit file `src\conf\prod.js` with template in `dev.js.template`. You need to provide mysql connection information, app's port and host server IP address
```javascript
import path from 'path'
export default {
  MYSQL_DB: 'blayncafe',            // Mysql information
  MYSQL_USER: 'root',
  MYSQL_PASSWORD: '',
  MYSQL_HOST: 'localhost',
  PORT: 3000,                       // Application port
  appRoot: path.join(__dirname, '../'),
  swaggerFile: path.join(__dirname, '../api/swagger/swagger.yaml'),
  swaggerFileUrl: '/swagger',
  host: 'http://52.77.212.240:3000' // API server's IP address
}

```
Install dependencies

```npm install```

Install foreverjs to persist API server

```$ [sudo] npm install forever -g```

### Build and run

```npm run build && npm run start```

## 2. Setup Backend server
### Install `nginx`
### Run build

```npm run build```

### Copy build files from `/dist` to nginx serve dir, for example `/var/www/html`
