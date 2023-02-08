const dotenv = require("dotenv")
const { RTMClient, WebClient } = require("@slack/client");
const { chatGPT } = require("./chatGPT");

dotenv.config();

const token = String(process.env.SLACK_TOKEN)
const botTag = String(process.env.BOT_TAG)

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
