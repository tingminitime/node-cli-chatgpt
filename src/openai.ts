console.log('[OpenAI]cbot Start !')
import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'
import chalk from 'chalk'
import { userInputHandler } from './utils/userInput'
import messageHandler from './utils/messageHandler'

dotenv.config()

const openAI = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
)

const { initMessages, addMessage } = messageHandler()

const main = async function () {
  try {
    const { userInput, isInputExit } = await userInputHandler()

    if (isInputExit) {
      console.log('Bye bye !')
      process.exit(0)
    }

    const messages = addMessage(initMessages, 'user', userInput)

    const chatCompletion = await openAI.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })

    /* Without stream */
    const answer = chatCompletion.data.choices[0].message?.content
    console.log(chalk.green.bold('AI: '), answer)

    messages.push({
      role: 'assistant',
      content: answer!,
    })
  } catch (error) {
    console.log('[main]error: ', error)
  }
}

main()
