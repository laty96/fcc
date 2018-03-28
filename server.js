// server.js
// where your node app starts

// init project
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

// Simple in-memory store
// const dreams = [
//   "Find and count some sheep",
//   "Climb a really tall mountain",
//   "Wash the dishes"
// ]

// app.get("/dreams", (request, response) => {
//   response.send(dreams)
// })

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

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
// app.post("/dreams", (request, response) => {
//   dreams.push(request.query.dream)
//   response.sendStatus(200)
// })

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})

