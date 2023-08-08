console.log('[OpenAI Azure]cbot Start !')
import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'
import { input } from '@inquirer/prompts'
import chalk from 'chalk'
import type Message from './types/message.js'

dotenv.config()

const basePath = `${process.env.AZURE_OPENAI_API_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`

const openAI = new OpenAIApi(
  new Configuration({
    basePath,
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

    /* Without stream */
    const chatCompletion = await openAI.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages,
      },
      {
        headers: {
          'api-key': process.env.AZURE_OPENAI_API_KEY!,
        },
        params: {
          'api-version': '2023-05-15',
        },
      },
    )

    const answer = chatCompletion.data.choices[0].message?.content
    console.log(chalk.green('AI: '), answer)

    messages.push({
      role: 'assistant',
      content: answer!,
    })
    // continue to next Q/A
    main()
  } catch (error) {
    console.log('[main]error: ', error)
  }
}

main()
