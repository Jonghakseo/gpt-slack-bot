import * as dotenv from "dotenv"
import {RTMClient, WebClient} from "@slack/client";
import {chatGPT} from "./chatGPT";
import type {ChatCompletionRequestMessage} from "openai";
import {getCacheData, setCacheData} from "./cache";

dotenv.config();

const token = String(process.env.SLACK_TOKEN)
const botTag = String(process.env.BOT_TAG)

const rtm = new RTMClient(token);
const web = new WebClient(token);

rtm.start();

rtm.on("message", (message) => {

  if (!!message.subtype) {
    return;
  }

  if (!message.text.includes(botTag)) {
    return
  }

  const messageText = message.text.replace(botTag, '')
  const newMessage : ChatCompletionRequestMessage = { role: "user", content: messageText };

  const key = message.thread_ts ?? message.ts;

  const cachedMessages: ChatCompletionRequestMessage[] = getCacheData(key) ?? []
  const newMessages: ChatCompletionRequestMessage[] = cachedMessages.concat(newMessage)
  setCacheData(key, newMessages)

  const reply = (text: string) => {
    web.chat.postMessage({
      channel: message.channel,
      thread_ts: message.ts,
      text
    })
  }

  (async () => {
    try {
      const response = await chatGPT({ messages:newMessages });

      const updatedMessages: ChatCompletionRequestMessage[] = newMessages.concat(response)
      setCacheData(key, updatedMessages)
      const replyMessage = messageText.length > 15 ? messageText.substring(0,15) + "..." : messageText
      reply(`💬 ${replyMessage}\n${response.content}`)
    } catch (error) {
      if (error instanceof Error) {
        reply(`💬 ${messageText}\n${error.message}`)
      }
    }
  })()
})
