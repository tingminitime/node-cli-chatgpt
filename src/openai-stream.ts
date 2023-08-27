import OpenAI from 'openai'
import dotenv from 'dotenv'
import chalk from 'chalk'
import { IncomingMessage } from 'http'
import { userInputHandler } from './utils/userInput.js'
import messageHandler from './utils/messageHandler.js'
import useOraLoading from './utils/loading.js'

dotenv.config()
console.log('[OpenAI Stream]cbot Start !')

const { messageHistory, addMessage } = messageHandler()
const { startLoading, succeedLoading, failLoading } = useOraLoading()

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const main = async function () {
  try {
    const { userInput, isInputExit } = await userInputHandler()

    if (isInputExit) {
      console.log('Bye bye !')
      process.exit(0)
    }

    const messages = addMessage(messageHistory, 'user', userInput)

    /* With stream */
    // TODO: Fix the stream
    startLoading()
    const chatCompletion = await openAI.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      stream: true,
    })
    succeedLoading()

    const stream = chatCompletion as unknown as IncomingMessage

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
