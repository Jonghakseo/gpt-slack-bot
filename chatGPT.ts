import * as dotenv from "dotenv"
import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from "openai";
dotenv.config();

const configuration = new Configuration({
  apiKey: String(process.env.OPENAI_API_KEY),
});
const openai = new OpenAIApi(configuration);


type ChatGPTInput = {
  messages: ChatCompletionRequestMessage[]
}

type Response = {
  role: 'assistant',
  content: string
}

export async function chatGPT({ messages }: ChatGPTInput): Promise<Response> {
  const completion = await openai.createChatCompletion({
    model:"gpt-3.5-turbo",
    max_tokens: 1800,
    messages:[
      ...messages
    ],
    temperature: 0,
  })

  const response = completion.data.choices.at(0)?.message?.content

  if (!response) {
    throw Error("알 수 없는 에러 : 응답을 찾을 수 없습니다.")
  }
  return {
    role:"assistant",
    content: response
  }
}

