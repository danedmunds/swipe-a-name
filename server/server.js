const express = require('express')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const winston = require('winston')
const expressWinston = require('express-winston')
const mongoose = require('mongoose')

const NamesRouter = require('./routes/names')

app = express()

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      colorize: true
    })
  ],
  msg: "HTTP {{req.method}} {{req.url}}",
  ignoreRoute: function (req, res) { return false; }
}));

// names aren't secure
let namesRouter = new NamesRouter()
namesRouter.initRoutes()
app.use('/api/v1/names', namesRouter.router)

// secure endpoints below
app.use(jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://danedmunds.auth0.com/.well-known/jwks.json`
  }),
  audience: 'J45whj0LyPxZv36xXBjDWVitpdjqclB5',
  issuer: 'https://danedmunds.auth0.com/',
  algorithms: [ 'RS256' ]
}));

let port = 3000
mongoose.connect('mongodb://localhost/swipe-a-name')
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(port, () => {
    console.log(`Listening on ${port}`)
  })
})
