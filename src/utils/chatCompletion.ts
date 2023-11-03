import OpenAI from 'openai'
import dotenv from 'dotenv'
import useOraLoading from './loading.ts'
import type Message from '@/types/message.ts'
import sleep from './sleep.ts'

type OpenAIChatCompletionsConfig = {
  model?: string
  temperature?: number
  messages?: Message[]
  stream?: boolean
}

dotenv.config()

const { startLoading, succeedLoading } = useOraLoading()

export const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * OpenAI chat completion
 * @param openAIChatCompletionsConfig
 * @returns
 */
export function useOpenAI(
  openAIChatCompletionsConfig?: OpenAIChatCompletionsConfig,
) {
  const createChatCompletion = async (messages: Message[]) => {
    startLoading()
    const chatCompletionData = await openAI.chat.completions.create({
      ...openAIChatCompletionsConfig,
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.1,
      stream: false,
    })
    succeedLoading()

    const answer = chatCompletionData.choices[0].message?.content

    return answer
  }

  return {
    createChatCompletion,
  }
}

export function useOpenAIStream(
  openAIChatCompletionsConfig?: OpenAIChatCompletionsConfig,
) {
  const createStreamChatCompletion = async (messages: Message[]) => {
    startLoading()
    sleep(5000)
    const stream = await openAI.chat.completions.create({
      ...openAIChatCompletionsConfig,
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.1,
      stream: true,
    })
    succeedLoading()

    let finalAnswer = ''

    for await (const part of stream) {
      const answer = part.choices[0]?.delta?.content || ''
      process.stdout.write(answer)
      finalAnswer += answer
    }

    process.stdout.write('\n')

    return finalAnswer
  }

  return {
    createStreamChatCompletion,
  }
}
