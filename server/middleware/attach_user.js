const Name = require('../models/Name')
const User = require('../models/User')
const _ = require('lodash')
const NameModel = new Name().createModel()
const UserModel = new User().createModel()
const userService = require('../services/user.service')()

module.exports = (allowNotFound) => async (req, res, next) => {
  let user 
  try {
    user = await UserModel.findOne({userId: req.id_token_decoded.sub})
    if (!user && !allowNotFound) {
      user = await userService.registerUser(req.id_token_decoded)
    }
  } catch (err) {
    console.log(err)
    res.status(err.status || 500).send({
      message: err.message
    })
  }
  

  req.user = user
  next()
}