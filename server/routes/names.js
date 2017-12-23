const express = require('express')
const Name = require('../models/Name')
const Rating = require('../models/Rating')
const _ = require('lodash')
const RatingTodo = new (require('../models/RatingTodo'))()
const NameModel = new Name().createModel()
const RatingModel = new Rating().createModel()
const querystring = require('querystring')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class NamesRouter {

  constructor (options) {
    this.router = express.Router()
  }

  initRoutes () {
    this.router.route('/')
      .get(this.getNames.bind(this))
  }

  getNames (req, res, next) {
    let username = req.user.username

    let offset = Number(req.query.offset || 0)
    let limit = Number(req.query.limit || 10)

    offset = offset <= 0 ? 0 : offset
    limit = limit <= 0 ? 0 : limit

    let sex = req.query.sex
    let query = {}
    if (sex) {
      query.sex = sex
    }

    let ratedStatus = 'ALL'
    if (req.query.rated === 'true') {
      ratedStatus = 'ONLY_RATED'
    } else if (req.query.rated === 'false') {
      ratedStatus = 'ONLY_UNRATED'
    }

    let model
    switch (ratedStatus) {
      case 'ONLY_RATED':
        model = RatingModel
        query.userId = new ObjectId(req.user.id)
        break
      case 'ONLY_UNRATED':
        model = RatingTodo.createModel(username)
        break
      default:
        model = NameModel
    }

    if (req.query.sample === 'true') {
      return model.randomSample(limit, (err, result) => {
        if (err) {
          return next(err)
        }
        res.send(result.map(this._serialize))
      })
    }

    model.paginate(query, { offset, limit, lean: true}, (err, result) => {
      if (err) {
        return next(err)
      }

      let baseUrl = req.protocol + '://' + req.get('host')
      let queryString = querystring.stringify(_.pick(req.query, ['sex', 'rated']))
      if (queryString != '') {
        queryString = queryString + '&'
      }
      let linkStart = `${baseUrl}/api/v1/names?${queryString}`

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
    return _.pick(toReturn, Name.PUBLIC_PROPERTIES)
  }
}

module.exports = NamesRouter
