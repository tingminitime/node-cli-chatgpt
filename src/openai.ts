import dotenv from 'dotenv'
import chalk from 'chalk'
import { useOpenAI } from './utils/chatCompletion.ts'
import { userInputHandler } from './utils/userInput.ts'
import useOraLoading from './utils/loading.ts'
import messageHandler from './utils/messageHandler.ts'

dotenv.config()
console.log('[OpenAI] Start !')

const { messageHistory, addMessage } = messageHandler()
const { startLoading, succeedLoading, failLoading } = useOraLoading()
const { createChatCompletion } = useOpenAI()

const main = async function () {
  try {
    const { userInput, isInputExit } = await userInputHandler()

    if (isInputExit) {
      console.log('Bye bye !')
      process.exit(0)
    }

    const messages = addMessage(messageHistory, 'user', userInput)

    const answer = await createChatCompletion(messages)

    console.log(chalk.green.bold('AI: '), answer)

    addMessage(messages, 'assistant', answer!)
    // continue to next Q/A
    main()
  } catch (error) {
    failLoading()
    console.log('[main]error: ', error)
  }
}

main()
