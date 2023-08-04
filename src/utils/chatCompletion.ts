import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'
import type Message from '@/types/message'

dotenv.config()

const openAI = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
)

// TODO
async function chatCompletion(messages: Message[]) {
  // const chatCompletion = await openAI.createChatCompletion({
  //   model: 'gpt-3.5-turbo',
  //   messages,
  // })
  // return {
  // }
}

export default chatCompletion
