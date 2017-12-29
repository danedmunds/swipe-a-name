const express = require('express')
const attachUser = require('../middleware/attach_user')
const User = require('../models/User')
const Name = require('../models/Name')
const UserModel = new User().createModel()
const NameModel = new Name().createModel()

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
    let id = req.id_token_decoded

    let user
    try {
      user = await new UserModel({
        userId: id.sub,
        email: id.email
      }).save()
    } catch (err) {
      console.log(err)
      return res.status(500).send({
        message: 'Failed to create user'
      })
    }

    try {
      await NameModel.prepareRatingTodoTableForUser(user._id)
    } catch (err) {
      console.log(err)
      return res.status(500).send({
        message: 'Failed to setup names for new user'
      })
    }
    
    return res.status(200).send(user.toJSON())
  }

  getUser (req, res, next) {
    res.send(req.user.toJSON())
  }
}

module.exports = UsersRouter
