const https = require('https');
const fs = require('fs');
const thread = require('./thread');

module.exports.sendMessage = (msg) => {
  let name = JSON.parse(fs.readFileSync('./messages.json', { encoding: 'utf-8' })).name;
  let message = msg.substring(1).replace(/[d]/i, ' ').replace('+', ' ').split(' ');
  let multiplier = parseInt(message[0]);
  let number = parseInt(message[1]);
  let add = parseInt(message[2]);

  let sum = 0;
  let response = '';
  for (let i = 0; i < multiplier; i++) {
    res = Math.ceil(Math.random() * number);
    sum += res
    response += `${res}, `
  }
  result = sum;

  let content = '';
  if (add !== NaN && add > 0) {
    content = `Rolando ${multiplier} dados de ${number} lados. Total: ${result} + ${add} = ${result + add}.\nResultados individuais:\n${response}`;
  } else {
    content = `Rolando ${multiplier} dados de ${number} lados. Total: ${result}.\nResultados individuais:\n${response}`;
  }


  const data = JSON.stringify({
    "ndcId": thread.ndcId,
    "threadId": thread.threadId,
    "message": { "content": content, "mediaType": 0, "type": 0, "sendFailed": false, "clientRefId": 3, "author": { "accountMembershipStatus": 0, "blogsCount": 0, "commentsCount": 0, "consecutiveCheckInDays": null, "content": null, "createdTime": "2021-11-23T17:19:53Z", "extensions": { "customTitles": [], "style": { "backgroundColor": "#000000" } }, "fanClubList": [], "followingStatus": 0, "icon": "http://pm1.narvii.com/8117/2da4208043698115f8ffa71fde02191238440792r1-554-554v2_00.jpg", "isGlobal": false, "isNicknameVerified": false, "itemsCount": 0, "joinedCount": 0, "level": 1, "mediaList": [[100, "http://pa1.narvii.com/8117/572a680838bc1ac95ce56cf2e377378aaa0ffae5r1-500-281_00.gif", null]], "membersCount": 1, "membershipStatus": 0, "modifiedTime": "2021-11-23T17:22:22Z", "mood": null, "moodSticker": null, "ndcId": 83992592, "nickname": "Ledice Bot", "notificationSubscriptionStatus": 0, "onlineStatus": 1, "postsCount": 0, "pushEnabled": true, "reputation": 0, "role": 0, "settings": { "onlineStatus": 1 }, "status": 0, "storiesCount": 0, "uid": "85b1ccca-d274-4501-a7f8-808344bd7a13", "webURL": "https://aminoapps.com/c/aordemparanorma/page/user/ledice-bot/6ZeB_LbIafWrPZmlPdQ3NLG8g3dQnb8xlw" }, "createdTime": Date.now() }
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
      console.log(d.toString())
    })
  });

  req.on("error", (err) => {
    console.log(err)
  })
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
