const express = require('express')
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
  app.listen(port, () => {
    console.log(`Listening on ${port}`)
  })
})
