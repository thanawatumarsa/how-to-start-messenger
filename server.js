'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = 'EAACYmbXFXNsBANi1czeuPYAMZAA4lbrLKdOqDlehmyaLHeE64ThDMeL6FcLozRZAa9MusR7Njz7VQstqNbVp7T0EeNpKp1EfS0sBGPEMnhFEllqSMXAkuqtPrydhfhzrHlQHGZCyovYyMEjCBLDMozE3Y80sljiFuerZAZB0Y1gZDZD'
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
      let text = event.message.text

      if (text)
        switch (text) {
          case 'hi' :
          case 'Hi' :
          case 'hello' :
          case 'Hello' :
          case 'สวัสดี' :
          case 'หวัดดี' :
          case 'ดีจ้า' :
          sendTextMessage (sender, "HI")
          sendGreetMessage(sender)
            break;
          default:sendTextMessage (sender, "หากต้องการเริ่มต้นใช้งาน ให้ทักทายเราว่า \"Hello\" ")
        }
    }
    if (event.postback) {
      let text = JSON.stringify(event.postback)
      sendTextMessage(sender, 'Postback received: ' + text.substring(0, 200), token)
      continue
    }
  }
  res.sendStatus(200)
})

function sendGreetMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text : "นี้คือคู่มือสถานที่ท่องเที่ยวของคุณในปราจีนบุรี แมวมีตัวเลือกให้ข้างล่าง",
            buttons: [{
              type: "postback",
              title: "🔎 หาที่เที่ยว",
              payload: "findLocation"
            }, {
              type: "postback",
              title: "👋 ไม่เป็นไร ขอบคุณ",
              payload: "noThank"
            }],
        }
      }
    }
  }
  // callSendAPI(messageData);
}

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

function sendGenericMessage (sender) {
  let messageData = {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [{
          'title': 'First card',
          'subtitle': 'Element #1 of an hscroll',
          'image_url': 'http://messengerdemo.parseapp.com/img/rift.png',
          'buttons': [{
            'type': 'web_url',
            'url': 'https://www.messenger.com',
            'title': 'web url'
          }, {
            'type': 'postback',
            'title': 'Postback',
            'payload': 'Payload for first element in a generic bubble'
          }]
        }, {
          'title': 'Second card',
          'subtitle': 'Element #2 of an hscroll',
          'image_url': 'http://messengerdemo.parseapp.com/img/gearvr.png',
          'buttons': [{
            'type': 'postback',
            'title': 'Postback',
            'payload': 'Payload for second element in a generic bubble'
          }]
        }]
      }
    }
  }
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
