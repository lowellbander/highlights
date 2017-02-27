'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot')
})

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
  const messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    const event = req.body.entry[0].messaging[i]
    const sender = event.sender.id
    if (event.message) {
      const messageText = getMessageText();
      sendTextMessage(sender, messageText);
    }
  }
  res.sendStatus(200)
})

app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})

function sendTextMessage(sender, text) {
  const token = 'EAAQ1j7TjxHUBAGZCJiNp8u5xqai1LZBVZCoRO4IE6RXVR2ba35IUFA2UzaOBcJf7gME3d56LJXy7JtM2LMok0vSWoXQwDuvMHtZA2qBChDoCc8O2uM8WRFibpIVvyosSZCk6DWHchghwE3gfxivkrvBHuPe2ZCAHYU4Eic7MTIoAZDZD';
  const messageData = {text: text};
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData,
    },
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function getMessageText() {
  const path = './database.json'
  const database = JSON.parse(fs.readFileSync(path));
  const {quote, title, author} = randomElement(database);
  return [quote, title, author].join('\n\n');
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

