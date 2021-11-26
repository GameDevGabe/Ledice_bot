const https = require('https')
const fs = require('fs');
const msg = require('./get-messages');
const send = require('./send-message');

const express = require('express');//Set up the express module
const app = express();
const router = express.Router();
const path = require('path')//Include the Path module

//Set up the Express router
router.get('/', function(req, res){
  res.send('HELLO');
});
app.use('/', router);

//Navigate your website
//if they go to '/lol'
router.get('/lol', function(req, res){
  res.sendFile(path.join(__dirname, '/lol.html'));
});
app.use('/lol', router);
//404 Error
app.use(function(req, res, next) {
    res.status(404);
    res.sendFile(__dirname + '/404.html');
});


//set up the Express server to listen on port 3000 and logs some messages when the server is ready
let server = app.listen(3000, function(){
  console.log("App server is running on port 3000");
});

function login() {
  const data = JSON.stringify({
    "recaptcha_challenge": "1", "recaptcha_version": "v3", "auth_type": 0, "secret": "BotDo1987", "email": "BotDoAmino@gmail.com"
  });

  const options = {
    hostname: 'aminoapps.com',
    port: 443,
    path: '/api/auth',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Cookie': 'session=.eJwNxk0LgjAYAOC_Eu-5Q5peBA_FTAreyWIh20XKDdn8IMRSXvG_13N6Vqjeduyfgx0mSKbxY_dg7NfVtnIGkhV2L0gAZR3xMpu1x1jnV0I6BVgKUvLWFsz02gvSOYYYqkBL4zAXkWYq5qxrUXZOyWzhxD1SMyNdWvwPvYjQ3x2Xj6VgZ1ew7MBlc0SRprBtP35yMyY.YZ0mNg.3ERRFP7Mh6lyg8vHLWsFHcBAgzk'
    }
  }

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    fs.writeFileSync('./sid.txt', res.headers["set-cookie"][0].split(';')[0].substring(4))

    res.on('data', d => {
    })
  })

  req.write(data)
  req.end()
}

try {
  login();
} catch (err) {
  console.log(err)
}


let current = JSON.parse(fs.readFileSync('./messages.json')).messageId
setInterval(() => {
  try {
    console.log(current);
    msg.getMessages();
    if (current !== JSON.parse(fs.readFileSync('./messages.json')).messageId) {
      send.sendMessage(JSON.parse(fs.readFileSync('./messages.json')).content)
      current = JSON.parse(fs.readFileSync('./messages.json')).messageId
    }
  } catch(err){
    console.log(err)
  }
  
}, 1000);






// POST /api/chat-thread-messages HTTP/2
// Host: aminoapps.com
// Cookie: sid=AnsiMSI6IG51bGwsICIwIjogMiwgIjMiOiAwLCAiMiI6ICI4NWIxY2NjYS1kMjc0LTQ1MDEtYTdmOC04MDgzNDRiZDdhMTMiLCAiNSI6IDE2Mzc2ODg4OTksICI0IjogIjIwMS4xMzEuMjQxLjY5IiwgIjYiOiA0MDB934Jq12uCUOVsdzLxh13p6yn7prQ
// Content-Length: 115
// Content-Type: application/json
// X-Requested-With: xmlhttprequest

