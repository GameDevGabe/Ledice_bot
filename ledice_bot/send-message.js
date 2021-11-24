const https = require('https');
const fs = require('fs');
const thread = require('./thread');
module.exports.sendMessage = (msg) => {

  let message = msg.substring(1).replace(/[dD]/, ' ').split(' ');
  let multiplier = parseInt(message[0]);
  let number = parseInt(message[1]);

  let sum = 0;
  let response = '';
  for(let i = 0; i <  multiplier; i++){
    res = Math.ceil(Math.random() * number);
    sum += res
    response += `${res},`
  }
  result = sum;
  

  const data = JSON.stringify({
    "ndcId": thread.ndcId,
    "threadId": thread.threadId,
    "message": {
      "content": `Rolando ${multiplier} dados de ${number} lados. Total: ${result}.\n${response}`,
      "author": {
        "settings": {
          "onlineStatus": 1
        },
        "uid": "85b1ccca-d274-4501-a7f8-808344bd7a13",
        "webURL": "https://aminoapps.com/c/os-programadores/page/user/ledice-bot/WnzV_zWukfRYL8JqLXw3bNelj3Xwa1lgqV"
      },
      "createdTime": Date.now()
    }
  });

  const options = {
    hostname: 'aminoapps.com',
    port: 443,
    path: '/api/add-chat-message',
    method: 'POST',
    headers: {
      'X-Requested-With': 'xmlhttprequest',
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Cookie': `sid=${fs.readFileSync('./sid.txt')}`
    }
  }

  const req = https.request(options, res => {
    res.on('data', d => {
    })
  });
  req.write(data);
  req.end();
  return
}

module.exports.sendLinks = () => {
  const data = JSON.stringify({
    "ndcId": thread.ndcId,
    "threadId": thread.threadId,
    "message": {
      "content": `http://aminoapps.com/p/2xj5e9\n\nhttp://aminoapps.com/p/yhfzp8\n\nhttp://aminoapps.com/p/ro9oep2\n\nhttp://aminoapps.com/p/1dlsuj`,
      "author": {
        "settings": {
          "onlineStatus": 1
        },
        "uid": "85b1ccca-d274-4501-a7f8-808344bd7a13",
        "webURL": "https://aminoapps.com/c/os-programadores/page/user/ledice-bot/WnzV_zWukfRYL8JqLXw3bNelj3Xwa1lgqV"
      },
      "createdTime": Date.now()
    }
  });

  const options = {
    hostname: 'aminoapps.com',
    port: 443,
    path: '/api/add-chat-message',
    method: 'POST',
    headers: {
      'X-Requested-With': 'xmlhttprequest',
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Cookie': `sid=${fs.readFileSync('./sid.txt')}`
    }
  }

  const req = https.request(options, res => {
    res.on('data', d => {
    })
  });
  req.write(data);
  req.end();
}
