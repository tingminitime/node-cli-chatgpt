// import { Configuration, OpenAIApi } from 'openai'
import OpenAI from 'openai'
import { OpenAIClient, AzureKeyCredential } from '@azure/openai'
import dotenv from 'dotenv'
import chalk from 'chalk'
import { IncomingMessage } from 'http'
import type Message from '@/types/message.js'

type OpenAIChatCompletionsConfig = {
  model: string
  temperature: number
  messages: Message[]
  stream: boolean
}

dotenv.config()

export const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const azureOpenAIClient = new OpenAIClient(
  process.env.AZURE_OPENAI_API_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!)
)

export function useOpenAI(
  openAIChatCompletionsConfig: OpenAIChatCompletionsConfig
) {
  const createChatCompletion = async (messages: Message[]) => {
    // const chatCompletionData = await openAI.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages,
    //   temperature: 0.1
    // })
    const chatCompletionData = await openAI.chat.completions.create({
      ...openAIChatCompletionsConfig,
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.1,
      stream: false,
    })

    const answer = chatCompletionData.choices[0].message?.content

    return answer
  }

  return {
    createChatCompletion,
  }
}

export function useAzureOpenAI() {
  const createChatCompletion = async (messages: Message[]) => {
    const chatCompletionData = await azureOpenAIClient.getChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
      messages,
      {
        temperature: 0.1,
      }
    )

    const answer = chatCompletionData.choices[0].message?.content

    return answer
  }

  return {
    createChatCompletion,
  }
}

// TODO
// export function useOpenAIStream() {
//   const createStreamChatCompletion = async (messages: Message[]) => {
//     const chatCompletionData = await openAI.createChatCompletion(
//       {
//         model: 'gpt-3.5-turbo',
//         messages,
//         stream: true,
//       },
//       {
//         responseType: 'stream', // if stream is true, responseType must be stream
//       },
//     )

//     const stream = chatCompletionData.data as unknown as IncomingMessage

//     let finalAnswer = ''

//     process.stdout.write(chalk.green.bold('AI: '))
//     stream.on('data', (chunk: Buffer) => {
//       const payloads = chunk.toString().split('\n\n')
//       for (const payload of payloads) {
//         if (payload.includes('[DONE]')) return
//         if (payload.startsWith('data:')) {
//           const data = JSON.parse(payload.replace('data: ', ''))
//           try {
//             const chunk: undefined | string = data.choices[0].delta?.content
//             process.stdout.write(chunk || '')
//             finalAnswer += chunk || ''
//           } catch (error) {
//             console.log(`Error with JSON.parse and ${payload}: `, error)
//           }
//         }
//       }
//     })

//     stream.on('end', () => {
//       setTimeout(() => {
//         console.log('\n[Stream done]')
//         addMessage(messages, 'assistant', finalAnswer)
//         // continue to next Q/A
//         main()
//       }, 10)
//     })
//   }

//   return {
//     createStreamChatCompletion
//   }
// }
