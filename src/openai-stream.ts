console.log('[OpenAI]cbot Start !')
import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'
import { input } from '@inquirer/prompts'
import chalk from 'chalk'
import { IncomingMessage } from 'http'
import type Message from './types/message'

dotenv.config()

const openAI = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
)

const messages: Message[] = [
  {
    role: 'system',
    content:
      '你是一位懂中文且有用的 AI 助手，接下來請你以「繁體中文」與我對話。',
  },
]

const main = async function () {
  try {
    const userInput = await input({
      message: chalk.blue('You: '),
    })

    if (userInput === 'exit') {
      console.log('Bye bye !')
      process.exit(0)
    }

    messages.push({
      role: 'user',
      content: userInput,
    })

    const chatCompletion = await openAI.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages,
        stream: true,
      },
      {
        responseType: 'stream', // if stream is true, responseType must be stream
      },
    )

    /* With stream */
    const stream = chatCompletion.data as unknown as IncomingMessage
    let finalAnswer = ''

    process.stdout.write(chalk.green.bold('AI: '))
    stream.on('data', (chunk: Buffer) => {
      const payloads = chunk.toString().split('\n\n')
      for (const payload of payloads) {
        if (payload.includes('[DONE]')) return
        if (payload.startsWith('data:')) {
          const data = JSON.parse(payload.replace('data: ', ''))
          try {
            const chunk: undefined | string = data.choices[0].delta?.content
            process.stdout.write(chunk || '')
            finalAnswer += chunk || ''
          } catch (error) {
            console.log(`Error with JSON.parse and ${payload}: `, error)
          }
        }
      }
    })

    stream.on('end', () => {
      setTimeout(() => {
        console.log('\n[Stream done]')
        messages.push({
          role: 'assistant',
          content: finalAnswer,
        })
        // continue to next Q/A
        main()
      }, 10)
    })
  } catch (error) {
    console.log('[main]error: ', error)
  }
}

main()
