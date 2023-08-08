console.log('[Azure OpenAI Stream]cbot Start !')
import { azureOpenAIClient } from './utils/chatCompletion.js'
import dotenv from 'dotenv'
import chalk from 'chalk'
import { userInputHandler } from './utils/userInput.js'
import messageHandler from './utils/messageHandler.js'
import useOraLoading from './utils/loading.js'

dotenv.config()

const { messageHistory, addMessage } = messageHandler()
const { startLoading, succeedLoading, failLoading } = useOraLoading()

const main = async function () {
  try {
    const { userInput, isInputExit } = await userInputHandler()

    if (isInputExit) {
      console.log('Bye bye !')
      process.exit(0)
    }

    const messages = addMessage(messageHistory, 'user', userInput)

    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!

    /* With stream */
    let finalAnswer = ''
    startLoading()
    const chatCompletions = await azureOpenAIClient.listChatCompletions(
      deploymentName,
      messages,
    )
    succeedLoading()

    process.stdout.write(chalk.green.bold('AI: '))
    for await (const chatCompletion of chatCompletions) {
      for (const choice of chatCompletion.choices) {
        const chunk: undefined | string = choice.delta?.content
        process.stdout.write(chunk || '')
        finalAnswer += chunk || ''
      }
    }

    setTimeout(() => {
      console.log('\n[Stream done]')
      addMessage(messages, 'assistant', finalAnswer)
      // continue to next Q/A
      main()
    }, 10)
  } catch (error) {
    failLoading()
    console.error('[main]error: ', error)
  }
}

main()
