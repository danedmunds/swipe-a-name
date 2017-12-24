const express = require('express')
const Rating = require('../models/Rating')
const Name = require('../models/Name')
const _ = require('lodash')
const RatingModel = new Rating().createModel()
const NameModel = new Name().createModel()
const RatingTodo = new (require('../models/RatingTodo'))()
const querystring = require('querystring')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class RatingsRouter {

  constructor (options) {
    this.router = express.Router()
  }

  initRoutes () {
    this.router.route('/')
      .get(this.getRatings.bind(this))
      .post(this.addRating.bind(this))
  }

  async addRating (req, res, next) {
    let nameIdInput = req.body.nameId
    if (!nameIdInput) {
      return res.status(400).send({
        message: 'Missing nameId'
      })
    }

    let nameId
    try {
      nameId = ObjectId(nameIdInput)
    } catch (err) {
      return res.status(400).send({
        message: 'nameId is invalid'
      })
    }

    let rating = req.body.rating
    if (!rating) {
      return res.status(400).send({
        message: 'Mising rating'
      })
    }

    if (!['keep', 'toss'].includes(rating)) {
      return res.status(400).send({
        message: 'rating is invalid, must be either "keep" or "toss"'
      })
    }

    let name
    try {
      name = await NameModel.findOne({_id: nameId}).exec()
      if (!name) {
        return res.status(400).send({
          message: `nameId ${nameIdInput} does not refer to an existing name`
        })
      }
    } catch (err) {
      return res.send(500).send({
        message: 'Error communicating with storage'
      })
    }
    
    let result = await RatingModel.findOneAndUpdate({
      userId: ObjectId(req.user.id),
      nameId: nameId
    }, {
      userId: ObjectId(req.user.id),
      nameId: nameId,
      rating: rating,
      name: name.name,
      sex: name.sex,
      date: Date.now()
    }, {
      upsert: true,
      new: true
    }).exec()

    await RatingTodo.createModel(req.user.id).deleteByNameId(nameId)

    return res.send(result)
  }

  getRatings (req, res, next) {
    let userId = req.user.id

    let offset = Number(req.query.offset || 0)
    let limit = Number(req.query.limit || 10)

    offset = offset <= 0 ? 0 : offset
    limit = limit <= 0 ? 0 : limit

    let sex = req.query.sex
    let query = _.merge({
      userId: new ObjectId(userId)
    }, _.pick(req.query, 'sex', 'rating'))


    RatingModel.paginate(query, {offset, limit, lean: true}, (err, result) => {
      if (err) {
        return next(err)
      }

      let baseUrl = req.protocol + '://' + req.get('host')
      let queryString = querystring.stringify(_.pick(req.query, ['sex', 'rated']))
      if (queryString != '') {
        queryString = queryString + '&'
      }
      let linkStart = `${baseUrl}/api/v1/ratings?${queryString}`

      res.send({
        data: result.docs.map(this._serialize),
        links: {
          self: `${linkStart}offset=${offset}&limit=${limit}`,
          next: `${linkStart}offset=${offset + limit}&limit=${limit}`,
          prev: `${linkStart}offset=${offset - limit >= 0 ? offset - limit  : 0}&limit=${limit}`,
          first: `${linkStart}offset=0&limit=${limit}`,
          last: `${linkStart}offset=${Math.floor(result.total / limit) * limit}&limit=${limit}`
        }
      })
    })
  }

  _serialize (item) {
    item = item.toObject ? item.toObject() : item
    let toReturn = _.cloneDeep(item)
    toReturn.id = toReturn.nameId || toReturn._id
    return _.pick(toReturn, Rating.PUBLIC_PROPERTIES)
  }
}

module.exports = RatingsRouter
