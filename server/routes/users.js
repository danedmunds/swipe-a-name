const express = require('express')
const attachUser = require('../middleware/attach_user')
const User = require('../models/User')
const Name = require('../models/Name')
const UserModel = new User().createModel()
const NameModel = new Name().createModel()
const userService = require('../services/user.service')()

class UsersRouter {

  constructor (options) {
    this.router = express.Router()
  }

  initRoutes () {
    this.router.route('/')
      .post(
        attachUser(true),
        this.registerUser.bind(this)
      )
    this.router.route('/:id')
      .get(
        attachUser(),
        this.getUser.bind(this)
      )
  }

  async registerUser (req, res, next) {
    try {
      let user = await userService.registerUser(req.id_token_decoded)
      return res.status(200).send(user.toJSON())
    } catch (err) {
      console.log('Failed to register user', err)
      return res.status(500).send({
        message: 'Failed to setup names for new user'
      })
    }
  }

  getUser (req, res, next) {
    res.send(req.user.toJSON())
  }
}

module.exports = UsersRouter
