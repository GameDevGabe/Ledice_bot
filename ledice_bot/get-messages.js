const messages = require('./messages')
const fs = require('fs');
const https = require('https');
const thread = require('./thread');
const config = require('./config');
const send = require('./send-message')

module.exports.getMessages = () => {
  let ndcId = thread.ndcId;
  let threadId = thread.threadId
  const regex = new RegExp(`${config.prefixo}([0-9]*[dD][0-9][0-9]*)`, 'g');
  const links = new RegExp(`${config.prefixo}loja`, 'g')
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
      try{
      if (regex.test(JSON.parse(d).result[0].content)) {
        let msgs = `\{"messageId": "${JSON.parse(d).result[0].messageId}","content": "${JSON.parse(d).result[0].content}"\}`
        fs.writeFileSync('./messages.json', msgs)
      }else if(links.test(JSON.parse(d).result[0].content)){
        send.sendLinks();
      }
      }catch(err){
        console.log(err)
      }
      res.on('error', err=>{
        console.log(err);
      })
    })
  });
  req.write(data);
  req.end();
  return
}

//`\{"messageId": "${JSON.parse(d).result[0].messageId}",\r\n"content": "${JSON.parse(d).result[0].content}"\}`

