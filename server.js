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

    if (messageText) {
     switch (messageText) {
      case 'HELLO':
      case 'hello':
      case 'Hello':
      case 'ดีจ้า':
      case 'สวัสดี':
      case 'หวัดดี':
      sendTextMessage(sender, "สวัสดี");
      break;
      case 'ขอบคุณ' :
      case 'ขอบใจ' :
      sendTextMessage(senderID, "ยินดีช่วยเหมียวว <3");
      break;
      case 'สัส' :
      case 'ควย' :
      case 'ฟวย' :
      case 'พ่องตาย' :
      case 'พ่อมึงตาย' :
      case 'แม่งตาย' :
      case 'แม่งตาย' :
      sendTextMessage(senderID, " 👎 สุภาพหน่อย ");
      break;
      case 'กาก' :
      case 'ควาย' :
      sendTextMessage(senderID, "เดะหน้าเป็นรอยหรอก 😾");
      break
      default:
      sendTextMessage(senderID, "พิมพ์อะไรแมวไม่รู้เรื่อง :p \n เลือกเมนูเอาข้างล่างละกัน " );
      sendGreetMessage(senderID)
      }
    }
    else if (messageAttachments) {
      sendTextMessage(senderID, "จุ๊บๆ");
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
