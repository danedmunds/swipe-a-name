const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const _ = require('lodash')

class Name {

  createModel () {
    if (mongoose.models[Name.MODEL_NAME]) {
      return mongoose.model(Name.MODEL_NAME)
    }
    return mongoose.model(Name.MODEL_NAME, this.createSchema())
  }

  createSchema() {
    let schema = new mongoose.Schema({
      name: { type: String, required: true, index: true },
      sex: { type: String, required: true, enum: ['M', 'F']}
    })

    schema.set('toJSON', {
      transform: doc => {
        return _.pick(doc, Name.PUBLIC_PROPERTIES)
      }
    })

    schema.statics.prepareRatingTodoTableForUser = function (username) {
      return this.aggregate([
        {
          $project: {
            _id: 0,
            name: 1,
            sex: 1,
            nameId: '$_id'
          }
        },
        {
          $out: `names_todo_${username}`
        }
       ]).exec()
    }

    schema.statics.randomSample = function (limit, next) {
      return this.aggregate(
        { $sample: { size: limit } }
     ).exec(next)
    }

    schema.plugin(mongoosePaginate)

    return schema
  }
}

Name.MODEL_NAME = 'Name'
Name.PUBLIC_PROPERTIES = ['id', 'name', 'sex']

module.exports = Name
