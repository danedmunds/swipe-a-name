const express = require('express')
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
      .post(this.createUser.bind(this))
    this.router.route('/:id')
      .get(this.getUser.bind(this))
    this.router.route('/:id/ratings')
      .get(this.getRatings.bind(this))
      .post(this.addRating.bind(this))
  }

  createUser (req, res, next) {
    let user = new UserModel({
      userId: '1234',
      username: 'dan'
    })
    user.save()
    .then((user) => {
      NameModel.find().cursor()
    }).catch((err) => {
      next(err)
    })
  }

  getUser (req, res, next) {
    res.sendStatus(501)
  }

  getRatings (req, res, next) {

  }

  addRating (req, res, next) {
    // TODO probably split to the |
    let userId = req.user.id

  }


}

module.exports = UsersRouter
