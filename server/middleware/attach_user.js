const Name = require('../models/Name')
const User = require('../models/User')
const _ = require('lodash')
const NameModel = new Name().createModel()
const UserModel = new User().createModel()

module.exports = () => async (req, res, next) => {
  let user = await UserModel.findOne({userId: req.user.sub})
  if (!user) {
    return res.status(401).send({
      code: 'USER_NOT_REGISTERED',
      message: `User hasn't registered yet`
    })
  }

  req.user = user
  next()
}