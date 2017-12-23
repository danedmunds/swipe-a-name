const mongoose = require('mongoose')
const Name = require('../models/Name')
const NameModel = new Name().createModel()

const readline = require('readline');
const fs = require('fs');

mongoose.connect('mongodb://localhost/swipe-a-name')
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  await Promise.all([
    ingest('../../names/male.txt', 'M'),
    ingest('../../names/female.txt', 'F')
  ])
  mongoose.connection.close()
})

function ingest(file, sex) {
  return new Promise((resolve, reject) => {
    const lineRead = readline.createInterface({
      input: fs.createReadStream(file)
    })
    let linesRead = 0
    let linedProcessed = 0
    lineRead
      .on('line', (line) => {
        linesRead++
        console.log('read ' + line)
        setImmediate(() => {
          new NameModel({
            name: line,
            sex: sex
          }).save(function (err) {
            if (err) {
              throw err
            }
            linedProcessed++
            console.log('saved ' + line)
          })
        })
      })
      .on('close', () => {
        waitForFinished()
        function waitForFinished () {
          console.log('checking if done')
          if (linesRead !== linedProcessed) {
            let wait = 100
            console.log(`Not done processing all lines, waiting ${wait}ms`)
            return setTimeout(() => waitForFinished(), wait)
          }
          return resolve()
        }
      })
  })
}
