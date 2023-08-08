console.log('[Azure OpenAI Stream]cbot Start !')
import { azureOpenAIClient } from './utils/chatCompletion.js'
import dotenv from 'dotenv'
import chalk from 'chalk'
import { userInputHandler } from './utils/userInput.js'
import messageHandler from './utils/messageHandler.js'
import useOraLoading from './utils/loading.js'
import sleep from './utils/sleep.js'
import recordMessagesHistory from './utils/saveLogs.js'

dotenv.config()

const { messageHistory, addMessage } = messageHandler()
const { startLoading, succeedLoading, failLoading } = useOraLoading()

let isAskQ: boolean = false
let askQ = '請依照此段文字提出一個問題。'
let askA = '請依照此段文字回答。'
// const afterPrompt =
//   '請你判斷以下文字，若為正常描述的肯定句文字，請你針對此段文字提出一個新的問題讓我思考回答；若不是肯定句而是一個詢問問題的問句，請你依照此問題進行回答。'

const main = async function (nextRound: boolean = false) {
  // console.log(`[Messages History]`, messageHistory.at(-1))

  try {
    if (!nextRound) {
      const { userInput, isInputExit } = await userInputHandler()

      if (isInputExit) {
        console.log('Bye bye !')
        process.exit(0)
      }

      addMessage(messageHistory, 'user', userInput)
    }

    // const messages = addMessage(messageHistory, 'user', userInput)

    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!

    /* With stream */
    let finalAnswer = ''
    startLoading()
    const chatCompletions = await azureOpenAIClient.listChatCompletions(
      deploymentName,
      messageHistory,
      {
        temperature: 0.7,
      },
    )
    if (nextRound) await sleep(1000)
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
      addMessage(
        messageHistory,
        isAskQ ? 'user' : 'assistant',
        `${isAskQ ? askQ : askA}\n${finalAnswer}`,
      )
      // addMessage(
      //   messageHistory,
      //   isAskQ ? 'user' : 'assistant',
      //   `${finalAnswer}\n${afterPrompt}`,
      // )
      // continue to next Q/A
      isAskQ = !isAskQ
      recordMessagesHistory(messageHistory.at(-1))
      main(true)
    }, 10)
  } catch (error) {
    failLoading()
    console.error('[main]error: ', error)
  }
}

main()
