const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')
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
      name: { type: String },
      sex: { type: String, enum: ['M', 'F'] },
      rating: { type: String, enum: ['keep', 'toss'] }
    })
    schema.index({nameId: 1, userId: 1}, { unique: true })

    schema.set('toJSON', {
      transform: doc => {
        return _.pick(doc, Rating.PUBLIC_PROPERTIES)
      }
    })

    schema.plugin(mongoosePaginate)

    return schema
  }
}

Rating.MODEL_NAME = 'Rating'
Rating.PUBLIC_PROPERTIES = ['id', 'nameId', 'userId', 'date', 'rating', 'name', 'sex']

module.exports = Rating
