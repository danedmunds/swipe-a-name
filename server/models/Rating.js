const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _ = require('lodash')

class Rating {

  createModel () {
    if (mongoose.models[Rating.MODEL_NAME]) {
      return mongoose.model(Rating.MODEL_NAME)
    }
    return mongoose.model(Rating.MODEL_NAME, this.createSchema())
  }

  createSchema() {
    let schema = new Schema({
      nameId: { type: Schema.Types.ObjectId, ref: 'Name' },
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date },
      rating: { type: String, enum: ['keep', 'toss'] }
    })


    schema.set('toJSON', {
      transform: doc => {
        return _.pick(doc, User.PUBLIC_PROPERTIES)
      }
    })

    return schema
  }
}

Rating.MODEL_NAME = 'Rating'
Rating.PUBLIC_PROPERTIES = ['id', 'nameId', 'userId', 'date', 'rating']

module.exports = Rating
