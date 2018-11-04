const express = require('express')
const https = require('https')
const fs = require('fs')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const winston = require('winston')
const expressWinston = require('express-winston')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const cors = require('cors')
const attachUser = require('./middleware/attach_user')

const NamesRouter = require('./routes/names')
const UsersRouter = require('./routes/users')
const RatingsRouter = require('./routes/ratings')

app = express()

app.use(cors())
app.use(bodyparser.json())

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      colorize: true
    })
  ],
  msg: "HTTP {{req.method}} {{req.url}}",
  ignoreRoute: function (req, res) { return false; },
  requestWhitelist: [ 'path' ]
}));

// In dev mode host the client at the root
if (process.env.DEV === '1' || process.env.DEV === 'true') {
  console.log('DEV MODE')
  let static = express.static('../client')
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api/')) {
      return static(req, res, next)
    }
    next()
  })
}

app.use(jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://danedmunds.auth0.com/.well-known/jwks.json"
  }),
  audience: 'J45whj0LyPxZv36xXBjDWVitpdjqclB5',
  issuer: "https://danedmunds.auth0.com/",
  algorithms: ['RS256']
}))
app.use((req, res, next) => {
  req.id_token_decoded = req.user
  delete req.user
  next()
})

let usersRouter = new UsersRouter()
usersRouter.initRoutes()
app.use('/api/v1/users', usersRouter.router)

// Below this point requests are rejected if the token doesn't correspond to a user
app.use(attachUser())

let namesRouter = new NamesRouter()
namesRouter.initRoutes()
app.use('/api/v1/names', namesRouter.router)

let ratingsRouter = new RatingsRouter()
ratingsRouter.initRoutes()
app.use('/api/v1/ratings', ratingsRouter.router)

let port = process.env.PORT || 3000
let connectionString = process.env.CONNECTIONSTRING || 'mongodb://localhost/swipe'
mongoose.connect(connectionString)
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(port, (err) => {
    if (err) {
      console.log(err)
      process.exit()
    }
    console.log(`Listening on ${port}`)

    if (process.env.HTTPS === '1') {
      let server = https.createServer({
        key: fs.readFileSync(process.env.HTTPS_KEY || '../certs/localhost.key').toString(),
        cert: fs.readFileSync(process.env.HTTPS_CERT || '../certs/localhost.crt').toString(),
        ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384',
        honorCipherOrder: true,
        secureProtocol: 'TLSv1_2_method'
      }, app)
      server.listen(3443, (err) => {
        if (err) {
          console.log(err)
          process.exit()
        }
        console.log(`Listening on 3443`)
      })
    }
  })
})
