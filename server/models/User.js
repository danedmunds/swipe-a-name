const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _ = require('lodash')

class User {

  createModel () {
    if (mongoose.models[User.MODEL_NAME]) {
      return mongoose.model(User.MODEL_NAME)
    }
    return mongoose.model(User.MODEL_NAME, this.createSchema())
  }

  createSchema() {
    let schema = new Schema({
      userId: { type: String, required: true, unique: true },
      username: { type: String, required: true, unique: true },
      email: { type: String, require: true, unique: true}
    })

    schema.set('toJSON', {
      transform: doc => {
        return _.pick(doc, User.PUBLIC_PROPERTIES)
      }
    })

    return schema
  }
}

User.MODEL_NAME = 'User'
User.PUBLIC_PROPERTIES = ['id', 'name', 'email']

module.exports = User
