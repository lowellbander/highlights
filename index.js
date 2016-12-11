'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
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
            let text = event.message.text.substring(0, 200)
            //sendTextMessage(sender, "Text received, echo: " + text)
            const messageText = getMessageText();
            sendTextMessage(sender, "received: " + text + '\n' + messageText);
        }
    }
    res.sendStatus(200)
})

const token = "EAAQ1j7TjxHUBAGZCJiNp8u5xqai1LZBVZCoRO4IE6RXVR2ba35IUFA2UzaOBcJf7gME3d56LJXy7JtM2LMok0vSWoXQwDuvMHtZA2qBChDoCc8O2uM8WRFibpIVvyosSZCk6DWHchghwE3gfxivkrvBHuPe2ZCAHYU4Eic7MTIoAZDZD";

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// END BOILERPLATE

const PATH = './text.txt'

function writeToFile({path, content}) {
  fs.writeFile(path, content, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  }); 
}

function getMessageText() {
  return fs.readFileSync(PATH)
}

//const foo = {a:4, b:5};

//writeToFile({path: './test.txt', content: JSON.stringify(foo)});
//writeToFile({path: './test.txt', content: new Date()});

