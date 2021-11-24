const https = require('https')
const fs = require('fs');
const messages = require('./messages');
const msg = require('./get-messages')
const config = require('./config');
const send = require('./send-message');

function login() {
  let sid;
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
    console.log(current)
    msg.getMessages();
    if (current !== JSON.parse(fs.readFileSync('./messages.json')).messageId) {
      send.sendMessage(JSON.parse(fs.readFileSync('./messages.json')).content)
      current = JSON.parse(fs.readFileSync('./messages.json')).messageId
    }
  } catch(err){
    console.log(err)
  }
  
}, 3000);






// POST /api/chat-thread-messages HTTP/2
// Host: aminoapps.com
// Cookie: sid=AnsiMSI6IG51bGwsICIwIjogMiwgIjMiOiAwLCAiMiI6ICI4NWIxY2NjYS1kMjc0LTQ1MDEtYTdmOC04MDgzNDRiZDdhMTMiLCAiNSI6IDE2Mzc2ODg4OTksICI0IjogIjIwMS4xMzEuMjQxLjY5IiwgIjYiOiA0MDB934Jq12uCUOVsdzLxh13p6yn7prQ
// Content-Length: 115
// Content-Type: application/json
// X-Requested-With: xmlhttprequest

