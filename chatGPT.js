const dotenv = require("dotenv")
const { Configuration, OpenAIApi } = require("openai");
dotenv.config();

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

/**
 *
 * @param prompt
 * @return {Promise<*|string>}
 */
async function chatGPT({ prompt }) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    max_tokens: 3600,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  return completion.data.choices[0]?.text ?? "알 수 없는 에러"
}

module.exports = {
  chatGPT
}
