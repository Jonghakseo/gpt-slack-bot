import * as dotenv from "dotenv"
import {Configuration, OpenAIApi} from "openai";
dotenv.config();

const configuration = new Configuration({
  apiKey: String(process.env.OPENAI_API_KEY),
});
const openai = new OpenAIApi(configuration);

/**
 *
 * @param prompt
 * @return {Promise<*|string>}
 */
export async function chatGPT({ prompt }) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    max_tokens: 3600,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  return completion.data.choices.at(0)?.text ?? "알 수 없는 에러"
}

