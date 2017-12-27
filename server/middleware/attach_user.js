const Name = require('../models/Name')
const User = require('../models/User')
const _ = require('lodash')
const NameModel = new Name().createModel()
const UserModel = new User().createModel()

module.exports = (allowNotFound) => async (req, res, next) => {
  let user = await UserModel.findOne({userId: req.id_token_decoded.sub})
  if (!user && !allowNotFound) {
    return res.status(401).send({
      code: 'USER_NOT_REGISTERED',
      message: `User hasn't registered yet`
    })
  }

  req.user = user
  next()
}