const mongoose = require('mongoose')
const User = require('../models/User')
const UserModel = new User().createModel()

const readline = require('readline');
const fs = require('fs');

mongoose.connect('mongodb://localhost/swipe-a-name')
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  try {
    let user = await new UserModel({
      userId: "google|1234",
      username: 'blahblah',
      email: 'blah@yopmail.com'
    }).save()
  } catch (err) {
    console.log(err)
  }
  mongoose.connection.close()
})