import * as dotenv from "dotenv"
import {RTMClient, WebClient} from "@slack/client";
import {chatGPT} from "./chatGPT";
import type {ChatCompletionRequestMessage} from "openai";

dotenv.config();

const token = String(process.env.SLACK_TOKEN)
const botTag = String(process.env.BOT_TAG)

const rtm = new RTMClient(token);
const web = new WebClient(token);

rtm.start();

const prompt = (input: string) => {
    return `
![IMG](https://api.placid.app/u/qsraj?title[text]=Join%20%20our%20Discord!%20discord.gg/cgpt%20)

INPUT = a photo of a cat
OUTPUT = ![IMG](https://image.pollinations.ai/prompt/a%20photo%20of%20a%20cat%20on%20a%20couch,%20comfortable,%20cute,%20colourful,%20interior%20photograph,%20interior design,%20Ansel Adams)

INPUT = a cat
OUTPUT = ![IMG](https://image.pollinations.ai/prompt/a%20photo%20of%20a%20cat%20on%20a%20beach,%20comfortable,%20cute,%20colourful,%20interior%20photograph,%20interior design,%20Ansel Adams)

INPUT = Fox with a cloak
OUTPUT = ![IMG](https://image.pollinations.ai/prompt/A%20fox%20wearing%20a%20cloak,%20cinematic,%20heroic,%20professional%20photography,%204k,%20photo%20realistic,%20Tim%20Burton)


INPUT(Please treat the following text as English) = ${input}`
}

rtm.on("message", (message) => {
    if (!!message.subtype) {
        return;
    }

    if (!message.text.includes(botTag)) {
        return
    }

    const messageText = message.text.replace(botTag, '')


    const reply = (text: string) => {
        web.chat.postMessage({
            channel: message.channel,
            thread_ts: message.ts,
            text
        })
    }

    (async () => {
        try {
            const translateTemplate: ChatCompletionRequestMessage = {
                role: "user",
                content: `Translate the following text to English:${messageText}`
            };
            const translated = await chatGPT({messages: [translateTemplate]});
            const newMessage: ChatCompletionRequestMessage = {role: "user", content: prompt(translated.content)};
            const response = await chatGPT({messages: [newMessage]});
            console.log(response)
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = response.content.match(urlRegex)?.[0];
            reply(`${urls}`)
        } catch (error) {
            if (error instanceof Error) {
                reply(`💬 ${messageText}\n${error.message}`)
            }
        }
    })()
})
