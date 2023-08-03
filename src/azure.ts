console.log('[Azure OpenAI]cbot Start !')
import { OpenAIClient, AzureKeyCredential } from '@azure/openai'
import dotenv from 'dotenv'
import { input } from '@inquirer/prompts'

dotenv.config()

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_API_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!),
)

;(async () => {
  const userInput = await input({
    message: 'You: ',
  })
  console.log(userInput)

  // const model = 'gpt-35-turbo'
  const model = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!

  const messages = [
    {
      role: 'system',
      content:
        '你是一位懂中文且有用的 AI 助手，接下來請你以「繁體中文」與我對話。',
    },
    {
      role: 'user',
      content: userInput,
    },
  ]

  const chatCompletions = await client.listChatCompletions(model, messages)

  for await (const chatCompletion of chatCompletions) {
    for (const choice of chatCompletion.choices) {
      // console.log(choice.delta?.content)
      const chunk: undefined | string = choice.delta?.content
      process.stdout.write(chunk || '')
    }
  }
})()
