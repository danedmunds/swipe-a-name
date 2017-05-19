const express = require('express')
const Name = require('../models/Name')
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
    let offset = Number(req.query.offset || 0)
    let limit = Number(req.query.limit || 10)

    offset = offset <= 0 ? 0 : offset
    limit = limit <= 0 ? 0 : limit

    NameModel.paginate({}, { offset, limit}, function(err, result) {
      if (err) {
        return next(err)
      }

      let baseUrl = req.protocol + '://' + req.get('host')
      res.send({
        data: result.docs,
        links: {
          self: `${baseUrl}/api/v1/names?offset=${offset}&limit=${limit}`,
          next: `${baseUrl}/api/v1/names?offset=${offset + limit}&limit=${limit}`,
          prev: `${baseUrl}/api/v1/names?offset=${offset - limit >= 0 ? offset - limit  : 0}&limit=${limit}`,
          first: `${baseUrl}/api/v1/names?offset=0&limit=${limit}`,
          last: `${baseUrl}/api/v1/names?offset=${Math.floor(result.total / limit) * limit}&limit=${limit}`
        }
      })
    })
  }
}

module.exports = NamesRouter
