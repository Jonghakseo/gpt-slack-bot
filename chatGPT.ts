import * as dotenv from "dotenv"
import {Configuration, OpenAIApi} from "openai";
dotenv.config();

const configuration = new Configuration({
  apiKey: String(process.env.OPENAI_API_KEY),
});
const openai = new OpenAIApi(configuration);


type ChatGPTInput = {
  prompt: string
}

export async function chatGPT({ prompt }: ChatGPTInput): Promise<string> {
  const completion =await openai.createChatCompletion({
    model:"gpt-3.5-turbo",
    // max 4000
    max_tokens: 4000,
    messages:[
      {"role": "system", "content": "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible."},
      {"role": "user", "content": prompt },
    ],
    // 의외성 (0~1)
    temperature: 0.7,
    // 단어 풀의 범위(0~1)
    top_p: 1,
    // 자주 사용하는 단어 억제
    frequency_penalty: 0.2,
    // 이미 사용된 단어 억제
    presence_penalty: 0.1
  })

  return completion.data.choices.at(0)?.message.content ?? "알 수 없는 에러"
}

