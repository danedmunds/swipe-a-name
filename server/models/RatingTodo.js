const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _ = require('lodash')
const mongoosePaginate = require('mongoose-paginate')

class RatingTodo {

  createModel (id) {
    if (mongoose.models[RatingTodo.MODEL_NAME]) {
      return mongoose.model(RatingTodo.MODEL_NAME)
    }
    return mongoose.model(RatingTodo.MODEL_NAME, this.createSchema(), `torank_${id}`)
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

    schema.statics.randomSample = function (limit, query, next) {
      let pipeline = []
      if (!_.isEmpty(query)) {
        pipeline.push({ $match: query })
      }
      pipeline.push({ $sample: { size: limit } })
      return this.aggregate(pipeline).exec(next)
    }

    schema.statics.deleteByNameId = function (nameId) {
      return this.findOneAndRemove({
        nameId
      }).exec()
    }

    schema.plugin(mongoosePaginate)

    return schema
  }
}

RatingTodo.MODEL_NAME = 'RatingTodo'
RatingTodo.PUBLIC_PROPERTIES = ['id', 'nameId', 'name', 'sex']

module.exports = RatingTodo
