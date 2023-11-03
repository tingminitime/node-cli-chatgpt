import dotenv from 'dotenv'
import { useOpenAIStream } from './utils/chatCompletion.ts'
import { userInputHandler } from './utils/userInput.ts'
import messageHandler from './utils/messageHandler.ts'
import useOraLoading from './utils/loading.ts'

dotenv.config()
console.log('[OpenAI Stream] Start !')

const { messageHistory, addMessage } = messageHandler()
const { startLoading, succeedLoading, failLoading } = useOraLoading()
const { createStreamChatCompletion } = useOpenAIStream({
  stream: true,
})

const main = async function () {
  try {
    const { userInput, isInputExit } = await userInputHandler()

    if (isInputExit) {
      console.log('Bye bye !')
      process.exit(0)
    }

    const messages = addMessage(messageHistory, 'user', userInput)

    const finalAnswer = await createStreamChatCompletion(messages)

    addMessage(messages, 'assistant', finalAnswer)
    // continue to next Q/A
    main()
  } catch (error) {
    failLoading()
    console.log('[main]error: ', error)
  }
}

main()
