console.log('[Azure OpenAI]cbot Start !')
import dotenv from 'dotenv'
import chalk from 'chalk'
import { userInputHandler } from './utils/userInput.js'
import useOraLoading from './utils/loading.js'
import messageHandler from './utils/messageHandler.js'
import { useAzureOpenAI } from './utils/chatCompletion.js'

dotenv.config()

const { messageHistory, addMessage } = messageHandler()
const { startLoading, succeedLoading, failLoading } = useOraLoading()
const { createChatCompletion } = useAzureOpenAI()

const main = async function () {
  try {
    const { userInput, isInputExit } = await userInputHandler()

    if (isInputExit) {
      console.log('Bye bye !')
      process.exit(0)
    }

    const messages = addMessage(messageHistory, 'user', userInput)

    /* Without stream */
    startLoading()
    const answer = await createChatCompletion(messages)
    succeedLoading()

    console.log(`${chalk.green.bold('AI:')} ${answer}`)

    addMessage(messages, 'assistant', answer!)
    // continue to next Q/A
    main()
  } catch (error) {
    failLoading()
    console.error('[main]error: ', error)
  }
}

main()
