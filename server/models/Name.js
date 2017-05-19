const mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
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

    schema.plugin(mongoosePaginate)

    return schema
  }
}

Name.MODEL_NAME = 'Name'
Name.PUBLIC_PROPERTIES = ['id', 'name', 'sex']

module.exports = Name
