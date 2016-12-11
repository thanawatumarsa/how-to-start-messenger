'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = 'EAACYmbXFXNsBAAVYXSpOYiBZBJyE8QYnf6XxAkKvN6d37N2CaCmW9ZC5UHReVZCZAv75JdoY5ZBEOxQ6rR1O4NyLYYxyM7kBBzlgIh9kZBElUDseyAEhHPvdPlRxU4SPoRwCPzO5LB3sGSXDhpZAeAjPgTMwtBZAZAT4QoGXfZBqSSAgZDZD'
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.get('/', function (req, res) {
  res.send('test test')
})
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'GussY123') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})
app.post('/webhook/', function (req, res) {
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]
    let sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text
      var nameCity = 'http://api.openweathermap.org/data/2.5/weather?q=' +location+ '&units=metric&appid=1dbb2e0928332cda13bbefb9104d13e4'
      request({
        url: nameCity,
        json: true
      }, function(error, response, body) {
        try {
          var condition = body.main;
          sendTextMessage(sender, "วันนี้ที่ " + text + " มีอุณหภูมิที่ " + condition.temp + " องศาเซลเซียส ")
        } catch(err) {
          console.error('error caught', err);
          sendTextMessage(sender, "ไม่พบชื่อเมืองที่ค้นหา กรุณากรอกชื่อเมืองอีกครั้ง");
        }
      })
    if (event.postback) {
      let text = JSON.stringify(event.postback)
      sendTextMessage(sender, 'Postback received: ' + text.substring(0, 200), token)
      continue
    }
  }
  res.sendStatus(200)
})

function sendTextMessage (sender, text) {
  let messageData = { text: text }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

app.listen(app.get('port'), function () {
  console.log('running on port', app.get('port'))
})
