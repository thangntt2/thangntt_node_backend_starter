Express & ES6 REST API Boilerplate
==================================

This is a straightforward boilerplate for building REST APIs with ES6 and Express.

- ES6 support via [babel](https://babeljs.io)
- CORS support via [cors](https://github.com/troygoode/node-cors)
- Body Parsing via [body-parser](https://github.com/expressjs/body-parser)

Getting Started
---------------

```sh
# clone it
git clone git@github.com:developit/express-es6-rest-api.git
cd express-es6-rest-api

# Make it your own
rm -rf .git && git init && npm init

# Install dependencies
npm install

# Start development live-reload server
npm run dev

# Start production server:
npm start

# Create migrate file
npm run migrate:create

# Run migrate
npm run migrate:latest
```
Docker Support
------
```sh
cd express-es6-rest-api

# Build your docker
docker build -t es6/api-service .
#            ^      ^           ^
#          tag  tag name      Dockerfile location

# run your docker
docker run -p 8080:8080 es6/api-service
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port   

```

Project dir
-------
```
└ project
  ├ src/                    # <-- Directory contains all source code
  | |
  | ├ conf/                 # <-- Directory contains all config
  | |
  | ├ controllers/          # <-- Directory contains all controllers
  | |
  | ├ models/               # <-- Directory contains all models.
  | |
  | ├ middleware/           # <-- Directory contains middleware such as authentication.
  | |
  | ├ migrations/           # <-- Directory contains migrations files
  | |
  ├ dist/                   # <-- Auto generated directory contains compiled
  |                         #     library to use in production.
  |
  ├ build/                  # <-- Auto generated directory contains compiled
  |                         #     artifacts for test & dev.
  |
  ├ .babelrc                # <-- Babel configuration file.
  |
  ├ .eslintrc               # <-- ESLint configuration file.
  |
  ├ index.js                # <-- Entry file. Load in build if NODE_ENV is
  |                         #     "development" or lib if NODE_ENV is "production"
  ├ router.js               # <-- Router file
  |
  ├ package.json            # <-- npm configuration file. Contains magic.
  |
  ├ README.md               # <-- This stupid file.
  |
  └  ...
```

Notes
-------
When creating new model, edit .src/models/index.js to add your new model below the lines (ofcourse, import it first)
```
const modules = [
  Student,
  BnCEvent,
  ...
]
```

License
-------

MIT
