const dotenv = require("dotenv")
const { RTMClient, WebClient } = require("@slack/client");
const { chatGPT } = require("./chatGPT");

dotenv.config();

const token = "xoxb-14819386034-4775550938816-78ZqAFBLD0o3lYoFpzSxYv9a"
const botTag = "<@U04NTG6TLQ0>"

const rtm = new RTMClient(token);
const web = new WebClient(token);

rtm.start();

rtm.on("message", (message) => {
  console.log(message)

  if (!!message.subtype){
    return;
  }

  if (!message.text.includes(botTag)){
    return
  }

  /**
   * @param text
   */
  const reply = (text) => {
    web.chat.postMessage({
      channel: message.channel,
      thread_ts: message.ts,
      text
    })
  }

  (async ()=> {
    try {
      const result = await chatGPT({ prompt: message.text.replace(botTag, '')});
      reply(result)
    }catch (error) {
      console.error(error)
      if (error instanceof Error){
        reply(error.message)
      }
    }
  })()

})

// 렌더 헬스체크
const express = require('express')
const app = express()
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
