import * as dotenv from "dotenv"
import { RTMClient, WebClient } from "@slack/client";
import { chatGPT } from "./chatGPT";

dotenv.config();

const token = String(process.env.SLACK_TOKEN)
const botTag = String(process.env.BOT_TAG)

const rtm = new RTMClient(token);
const web = new WebClient(token);

rtm.start();

rtm.on("message", (message) => {

  if (!!message.subtype){
    return;
  }

  if (!message.text.includes(botTag)){
    return
  }

  const messageText = message.text.replace(botTag, '')

  const reply = (text:string) => {
    web.chat.postMessage({
      channel: message.channel,
      thread_ts: message.ts,
      text
    })
  }

  (async ()=> {
    try {
      const result = await chatGPT({ prompt: messageText });
      reply(`|> ${messageText}\n${result}`)
    }catch (error) {
      if (error instanceof Error){
        reply(`|> ${messageText}\n${error.message}`)
      }
    }
  })()

})
