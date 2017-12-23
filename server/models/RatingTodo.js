const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _ = require('lodash')
const mongoosePaginate = require('mongoose-paginate')

class RatingTodo {

  createModel (username) {
    if (mongoose.models[RatingTodo.MODEL_NAME]) {
      return mongoose.model(RatingTodo.MODEL_NAME)
    }
    return mongoose.model(RatingTodo.MODEL_NAME, this.createSchema(), `names_todo_${username}`)
  }

  createSchema() {
    let schema = new Schema({
      nameId: { type: Schema.Types.ObjectId, ref: 'Name' },
      name: { type: String, required: true },
      sex: { type: String, required: true, enum: ['M', 'F']}
    })

    schema.set('toJSON', {
      transform: doc => {
        return _.pick(doc, RatingTodo.PUBLIC_PROPERTIES)
      }
    })

    schema.plugin(mongoosePaginate)

    return schema
  }
}

RatingTodo.MODEL_NAME = 'RatingTodo'
RatingTodo.PUBLIC_PROPERTIES = ['id', 'nameId', 'name', 'sex']

module.exports = RatingTodo
