console.log('[Azure OpenAI]cbot Start !')
import { OpenAIClient, AzureKeyCredential } from '@azure/openai'
import dotenv from 'dotenv'
import { input } from '@inquirer/prompts'
import chalk from 'chalk'
import type Message from './types/message'

dotenv.config()

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_API_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!),
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

    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!

    /* With stream */
    let finalAnswer = ''
    const chatCompletions = await client.listChatCompletions(
      deploymentName,
      messages,
    )

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
      messages.push({
        role: 'assistant',
        content: finalAnswer,
      })
      main()
    }, 10)
  } catch (error) {
    console.error('[main]error: ', error)
  }
}

main()
