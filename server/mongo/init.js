const mongoose = require('mongoose')
const Name = require('../models/Name')
const NameModel = new Name().createModel()

const readline = require('readline');
const fs = require('fs');

mongoose.connect('mongodb://localhost/swipe-a-name')
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  const maleLineReader = readline.createInterface({
    input: fs.createReadStream('../names/male.txt')
  });
  maleLineReader.on('line', function (line) {
    console.log(`processing ${line}`)
    new NameModel({
      name: line,
      sex: 'M'
    }).save(function (err) {
      if (err) {
        console.error(`Failed to save ${line}: ${err}`)
      } else {
        console.log(`Saved ${line}`)
      }
    })
  });

  const femaleLineReader = readline.createInterface({
    input: fs.createReadStream('../names/female.txt')
  });
  femaleLineReader.on('line', function (line) {
    console.log(`processing ${line}`)
    new NameModel({
      name: line,
      sex: 'F'
    }).save(function (err) {
      if (err) {
        console.error(`Failed to save ${line}: ${err}`)
      } else {
        console.log(`Saved ${line}`)
      }
    })
  });
});
