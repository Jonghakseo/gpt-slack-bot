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
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    // 의외성 (0~1)
    temperature: 0.7,
    // max 4000
    max_tokens: 3600,
    // 단어 풀의 범위(0~1)
    top_p: 1,
    // 자주 사용하는 단어 억제
    frequency_penalty: 0.5,
    // 이미 사용된 단어 억제
    presence_penalty: 0.1
  });

  return completion.data.choices.at(0)?.text ?? "알 수 없는 에러"
}

