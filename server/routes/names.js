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

    let sex = req.query.sex
    let query = {}
    if (sex) {
      query.sex = sex
    }

    NameModel.paginate(query, { offset, limit}, function(err, result) {
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
        data: result.docs,
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
