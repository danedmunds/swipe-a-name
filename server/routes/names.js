const express = require('express')
const Name = require('../models/Name')
const _ = require('lodash')
const RatingTodo = new (require('../models/RatingTodo'))()
const NameModel = new Name().createModel()

class NamesRouter {

  constructor (options) {
    this.router = express.Router()
  }

  initRoutes () {
    this.router.route('/')
      .get(this.getNames.bind(this))
  }

  getNames (req, res, next) {
    // TODO
    let username = 'blahblah'

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
      case 'ONLY_UNRATED':
        // TODO split these
        model = RatingTodo.createModel(username)
        break
      default:
        model = NameModel
    }

    model.paginate(query, { offset, limit, lean: true}, function(err, result) {
      if (err) {
        return next(err)
      }

      let baseUrl = req.protocol + '://' + req.get('host')
      let queryString = `${sex ? 'sex=' + sex : ''}`
      if (queryString != '') {
        queryString = queryString + '&'
      }
      let linkStart = `${baseUrl}/api/v1/names?${queryString}`

      res.send({
        data: result.docs.map((item) => {
          let toReturn = _.cloneDeep(item)
          toReturn.id = toReturn.nameId || toReturn._id
          return _.pick(toReturn, Name.PUBLIC_PROPERTIES)
        }),
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
}

module.exports = NamesRouter
