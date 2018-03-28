// server.js
// where your node app starts

// init project
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const validator = require('validator').isURL

var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var url = 'mongodb://admin:admin@ds227199.mlab.com:27199/shorten'

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/ts', (req, res) => {
  res.sendFile(__dirname + '/views/ts.html')
})

app.get('/ts/:time', (req, res) => {
  let time = req.params.time
  if (isNaN(time) == false) {
    time = time * 1000  
  }
  let a = new Date(time)
  if (a == 'Invalid Date') {
    res.status(400).send({
      unix: null,
      natural: null
    })
  } else {
    let b = a.toLocaleString('en-us', {month: 'long'})
    let c = a.getDate()
    let d = a.getFullYear()
    res.status(200).send({
      unix: a.getTime() / 1000,
      natural: b + ' ' + c + ', ' + d
    })
  }
})

app.get('/rhpm', (req, res) => {
  let b = req.headers['x-forwarded-for'].split(',')[0]
  let c = req.headers['accept-language'].split(',')[0]
  let d = req.headers['user-agent']
  res.status(200).send({
    "ipaddress": b,
    "language": c,
    "software": d
  })
})

app.get('/sht' , (req, res) => {
  res.sendFile(__dirname + '/views/shorten.html')
})

app.get('/sht/:id' , (req, res) => {
  let id = +req.params.id
  MongoClient.connect(url, function(err, client) {

      console.log("Connected correctly to server");
      let db = client.db('shorten');
      let collection = db.collection('urls')
      collection.find({id}).toArray((err, result) => {
        console.log(result)
        if (err) console.log(err)
        if (result.length >= 1) {
          res.redirect(result[0].url)
        } else {
          res.status(404).send({error: 'error',
                               res: result})
        }
      })

    });
})

app.get('/sht/new/*' , (req, res) => {
  let link = req.params[0]
  if (validator(link)) {
    MongoClient.connect(url, function(err, client) {

      console.log("Connected correctly to server");
      let db = client.db('shorten');
      let collection = db.collection('urls')
      collection.find({url: link}).toArray((err, result) => {
        console.log(result)
        if (err) console.log(err)
        if (result.length >= 1) {
          res.status(200).send({
            "original_url": link, 
            "short_url": 'https://api-projects.glitch.me/sht/' + result[0].id 
          })
        } else {
          collection.find().count((err, result2) => {
            if (err) console.log(err)
            if (result2 >= 0) {
              let id = result2 + 1
              collection.insertOne({
                url: link,
                id: id
              }, (err, result3) => {
                if (err) {
                console.log(err)
                res.status(500).send('error')
                }
                if (result3) {
                  res.status(200).send({
                    "original_url": link, 
                    "short_url": 'https://api-projects.glitch.me/sht/' + id
                  })
                }
                client.close()
              });
            }
          })
        }
      })

    });
  
  }
})
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})

