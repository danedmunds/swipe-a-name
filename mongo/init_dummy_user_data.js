const mongoose = require('mongoose')
const User = require('../server/models/User')
const UserModel = new User().createModel()
const Name = require('../server/models/Name')
const NameModel = new Name().createModel()

const readline = require('readline');
const fs = require('fs');

mongoose.connect('mongodb://localhost/swipe')
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  try {
    let user = await new UserModel({
      userId: "google|1234",
      username: 'blahblah',
      email: 'blah@yopmail.com'
    }).save()
    await NameModel.prepareRatingTodoTableForUser(user.username)
  } catch (err) {
    console.log(err)
  }
  mongoose.connection.close()
})