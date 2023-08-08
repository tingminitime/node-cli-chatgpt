console.log('[OpenAI Stream]cbot Start !')
import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'
import chalk from 'chalk'
import { IncomingMessage } from 'http'
import { userInputHandler } from './utils/userInput.js'
import messageHandler from './utils/messageHandler.js'
import useOraLoading from './utils/loading.js'

dotenv.config()

const { messageHistory, addMessage } = messageHandler()
const { startLoading, succeedLoading, failLoading } = useOraLoading()

const openAI = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
)

const main = async function () {
  try {
    const { userInput, isInputExit } = await userInputHandler()

    if (isInputExit) {
      console.log('Bye bye !')
      process.exit(0)
    }

    const messages = addMessage(messageHistory, 'user', userInput)

    /* With stream */
    startLoading()
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
    succeedLoading()

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
        addMessage(messages, 'assistant', finalAnswer)
        // continue to next Q/A
        main()
      }, 10)
    })
  } catch (error) {
    failLoading()
    console.log('[main]error: ', error)
  }
}

main()
