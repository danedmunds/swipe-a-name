const mongoose = require('mongoose')
const _ = require('lodash')

class User {

  createModel () {
    if (mongoose.models[User.MODEL_NAME]) {
      return mongoose.model(User.MODEL_NAME)
    }
    return mongoose.model(User.MODEL_NAME, this.createSchema())
  }

  createSchema() {
    let ratingSchema = new mongoose.Schema({
      nameRecord: { type: Schema.Types.ObjectId, ref: 'Name' }
      date: { type: Date, default: Date.now },
      rating: { type: String, enum: ['keep', 'toss'] }
    })

    let schema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      ratings: [ ratingSchema ]
    })

    schema.set('toJSON', {
      transform: doc => {
        return _.pick(doc, User.PROPERTIES)
      }
    })

    return schema
  }
}

User.MODEL_NAME = 'User'
User.PUBLIC_PROPERTIES = ['id', 'name', 'email', 'ratings']

module.exports = User
