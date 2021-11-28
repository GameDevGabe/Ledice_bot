const https = require('https');
const fs = require('fs');
const config = require('./config');

module.exports.listen = () => {
  const ndcId = config.threadInfo.ndcId;
  const threadId = config.threadInfo.threadId;
  const regex = new RegExp(`(^${config.prefix}[0-9][0-9]*d[0-9][0-9]*(\\+[0-9][0-9]*|\\([0-9][0-9]*\\))*$)`, 'i');
  const regexl = new RegExp(`^${config.prefix}loja$`, 'i');

  const data = JSON.stringify({
    "ndcId": ndcId,
    "threadId": threadId,
    "size": 1,
    "starttime": "2020-11-23T17:57:33Z"
  });

  const options = {
    hostname: 'aminoapps.com',
    port: 443,
    path: '/api/chat-thread-messages',
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
      const current = JSON.parse(fs.readFileSync('./messages.json')).messageId
      console.log(current);
      try{
        if (regex.test(JSON.parse(d).result[0].content) && JSON.parse(d).result[0].messageId !== current) {
          fs.writeFileSync('./messages.json', `{"messageId": "${JSON.parse(d).result[0].messageId}", "content": "${JSON.parse(d).result[0].content}"}`);
          try {
            dice(JSON.parse(d).result[0].content);
          } catch (err) {
            if (err) {
              console.log(err)
            }
          }
          console.log(`Novo comando: ${JSON.parse(d).result[0].content}, por ${JSON.parse(d).result[0].author.messageId}`);

        } else if (regexl.test(JSON.parse(d).result[0].content) && JSON.parse(d).result[0].messageId !== current) {
          fs.writeFileSync('./messages.json', `{"messageId": "${JSON.parse(d).result[0].messageId}", "content": "${JSON.parse(d).result[0].content}"}`);
          try {
            shop();
          } catch (err) {
            if (err) {
              console.log(err)
            }
          }
          console.log(`Novo comando: ${JSON.parse(d).result[0].content}, por ${JSON.parse(d).result[0].messageId}`);
        }
      }catch(err){
        if(err){
          console.log(err)
          module.exports.listen();
        }
      }
    });

    res.on('error', err => {
      if (err) {
        console.log(err)
      }
    });
  });

  req.write(data);
  req.end();
  return
}

dice = (dice) => {
  let msg = ''
  const tabela = {
    1: {
      N: 20
    },
    2: {
      N: 19,
      B: 20
    },
    3: {
      N: 18,
      B: 20
    },
    4: {
      N: 17,
      B: 19
    },
    5: {
      N: 16,
      B: 19,
      E: 20
    },
    6: {
      N: 15,
      B: 18,
      E: 20
    },
    7: {
      N: 14,
      B: 18,
      E: 20
    },
    8: {
      N: 13,
      B: 17,
      E: 20
    },
    9: {
      N: 12,
      B: 17,
      E: 20
    },
    10: {
      N: 11,
      B: 16,
      E: 19
    },
    11: {
      N: 11,
      B: 16,
      E: 19
    },
    12: {
      N: 9,
      B: 15,
      E: 19
    },
    13: {
      N: 8,
      B: 15,
      E: 19
    },
    14: {
      N: 7,
      B: 14,
      E: 19
    },
    15: {
      N: 6,
      B: 14,
      E: 18
    },
    16: {
      N: 5,
      B: 13,
      E: 18
    },
    17: {
      N: 4,
      B: 13,
      E: 18
    },
    18: {
      N: 3,
      B: 12,
      E: 18
    }
  }

  if (dice.includes('+')) {
    let arr = dice.replace(`${config.prefix}`, '').replace(/d/i, ' ').replace('+', ' ').split(' '); //!1d20+10 --> ['1', '20', '10']
    let quant = parseInt(arr[0]); // 1
    let sides = parseInt(arr[1]); // 20
    let add = parseInt(arr[2]); // 10
    let sum = 0;
    let values = ``
    for (let i = 0; i < quant; i++) {
      let temp = Math.ceil(Math.random() * sides);
      sum += temp;
      values += `${temp} `
    }

    msg = `Rolando ${quant} dado(s) de ${sides} lados. Resultado: ${sum} + ${add} = ${sum + add}.\nResultados individuais:\n${values}`;
  } else if (dice.includes('(')) {
    let test = 2
    let arr = dice.replace(`${config.prefix}`, '').replace(/d/i, ' ').replace('(', ' ').replace(')', '').split(' '); //!1d20(18) --> 1 20 18
    let quant = parseInt(arr[0]); // 1
    let sides = parseInt(arr[1]); // 20  
    let per = tabela[parseInt(arr[2])];
    let sum = 0;
    let values = ``
    for (let i = 0; i < quant; i++) {
      let temp = Math.ceil(Math.random() * sides);
      sum += temp;
      if ((temp >= per["N"] && temp < per["B"] && per.hasOwnProperty("B")) || (temp >= per["N"] && !temp.hasOwnProperty("B"))) {
        values += `${temp}(N) `
      } else if (per.hasOwnProperty("B") && temp >= per["B"] && temp < per["E"]) {
        values += `${temp}(B) `
      } else if (per.hasOwnProperty("E") && temp >= per["E"]) {
        values += `${temp}(E) `
      } else {
        values += `${temp}(F) `
      }

    }
    msg = `Rolando ${quant} dado(s) de ${sides} lados.\nTotal: ${sum}\n ${values}`
    console.log(per["B"])
    console.log(msg)
  } else {
    let arr = dice.replace(`${config.prefix}`, '').replace(/d/i, ' ').split(' '); //!1d20 --> ['1', '20']
    let quant = parseInt(arr[0]); // 1
    let sides = parseInt(arr[1]); // 20
    let values = ''
    let sum = 0;
    for (let i = 0; i < quant; i++) {
      let temp = Math.ceil(Math.random() * sides);
      sum += temp;
      values += `${temp} `
    }

    msg = `Rolando ${quant} dado(s) de ${sides} lados. Resultado: ${sum}.\nResultados individuais:\n${values}`;
  }

  const data = JSON.stringify({
    "ndcId": config.threadInfo.ndcId,
    "threadId": config.threadInfo.threadId,
    "message": { "content": msg, "mediaType": 0, "type": 0, "sendFailed": false, "clientRefId": 3, "author": { "accountMembershipStatus": 0, "blogsCount": 0, "commentsCount": 0, "consecutiveCheckInDays": null, "content": null, "createdTime": "2021-11-23T17:19:53Z", "extensions": { "customTitles": [], "style": { "backgroundColor": "#000000" } }, "fanClubList": [], "followingStatus": 0, "icon": "http://pm1.narvii.com/8117/2da4208043698115f8ffa71fde02191238440792r1-554-554v2_00.jpg", "isGlobal": false, "isNicknameVerified": false, "itemsCount": 0, "joinedCount": 0, "level": 1, "mediaList": [[100, "http://pa1.narvii.com/8117/572a680838bc1ac95ce56cf2e377378aaa0ffae5r1-500-281_00.gif", null]], "membersCount": 1, "membershipStatus": 0, "modifiedTime": "2021-11-23T17:22:22Z", "mood": null, "moodSticker": null, "ndcId": 83992592, "nickname": "Ledice Bot", "notificationSubscriptionStatus": 0, "onlineStatus": 1, "postsCount": 0, "pushEnabled": true, "reputation": 0, "role": 0, "settings": { "onlineStatus": 1 }, "status": 0, "storiesCount": 0, "uid": "85b1ccca-d274-4501-a7f8-808344bd7a13", "webURL": "https://aminoapps.com/c/aordemparanorma/page/user/ledice-bot/6ZeB_LbIafWrPZmlPdQ3NLG8g3dQnb8xlw" }, "createdTime": Date.now() }
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
  })
  req.on("error", err => {
    console.log(err)
  })

  req.write(data);
  req.end();
  return
}

shop = () => {
  const data = JSON.stringify({
    "ndcId": config.threadInfo.ndcId,
    "threadId": config.threadInfo.threadId,
    "message": { "content": 'http://aminoapps.com/p/2xj5e9\n\nhttp://aminoapps.com/p/yhfzp8\n\nhttp://aminoapps.com/p/ro9oep2n\n\nhttp://aminoapps.com/p/1dlsuj', "mediaType": 0, "type": 0, "sendFailed": false, "clientRefId": 3, "author": { "accountMembershipStatus": 0, "blogsCount": 0, "commentsCount": 0, "consecutiveCheckInDays": null, "content": null, "createdTime": "2021-11-23T17:19:53Z", "extensions": { "customTitles": [], "style": { "backgroundColor": "#000000" } }, "fanClubList": [], "followingStatus": 0, "icon": "http://pm1.narvii.com/8117/2da4208043698115f8ffa71fde02191238440792r1-554-554v2_00.jpg", "isGlobal": false, "isNicknameVerified": false, "itemsCount": 0, "joinedCount": 0, "level": 1, "mediaList": [[100, "http://pa1.narvii.com/8117/572a680838bc1ac95ce56cf2e377378aaa0ffae5r1-500-281_00.gif", null]], "membersCount": 1, "membershipStatus": 0, "modifiedTime": "2021-11-23T17:22:22Z", "mood": null, "moodSticker": null, "ndcId": 83992592, "nickname": "Ledice Bot", "notificationSubscriptionStatus": 0, "onlineStatus": 1, "postsCount": 0, "pushEnabled": true, "reputation": 0, "role": 0, "settings": { "onlineStatus": 1 }, "status": 0, "storiesCount": 0, "uid": "85b1ccca-d274-4501-a7f8-808344bd7a13", "webURL": "https://aminoapps.com/c/aordemparanorma/page/user/ledice-bot/6ZeB_LbIafWrPZmlPdQ3NLG8g3dQnb8xlw" }, "createdTime": Date.now() }
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
  })
  req.on("error", err => {
    console.log(err)
  })

  req.write(data);
  req.end();
  return
}