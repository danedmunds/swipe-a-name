const mongoose = require('mongoose')
const Rating = require('../models/Rating')
const RatingModel = new Rating().createModel()
const User = require('../models/User')
const UserModel = new User().createModel()
const Name = require('../models/Name')
const NameModel = new Name().createModel()

const readline = require('readline');
const fs = require('fs');

mongoose.connect('mongodb://localhost/swipe')
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  try {
    let user = await UserModel.find({'username': 'blahblah'}).exec()
    if (!user) {
      throw new Error('no user found')
    }
    let names = await NameModel.find().limit(20).exec()
    await Promise.all(names.map(name => {
      console.log(`Adding rating for ${name.name}`)
      return new RatingModel({
        userId: user.id,
        nameId: name.id,
        rating: Math.floor(Math.random() * 2) === 0 ? 'toss' : 'keep'
      }).save()
    }))
  } catch (err) {
    console.log(err)
  }
  mongoose.connection.close()
})