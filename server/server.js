const express = require('express')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const winston = require('winston')
const expressWinston = require('express-winston')
const mongoose = require('mongoose')

const NamesRouter = require('./routes/names')
const UsersRouter = require('./routes/users')

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

//TODO temporary
app.use((req, res, next) => {
  req.user = {
    username: 'blahblah'
  }
  next()
})

let namesRouter = new NamesRouter()
namesRouter.initRoutes()
app.use('/api/v1/names', namesRouter.router)

let usersRouter = new UsersRouter()
usersRouter.initRoutes()
app.use('/api/v1/users', usersRouter.router)

let port = 3000
mongoose.connect('mongodb://localhost/swipe-a-name')
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(port, () => {
    console.log(`Listening on ${port}`)
  })
})
