console.log('[OpenAI]cbot Start !')
import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'
import { input } from '@inquirer/prompts'

dotenv.config()

const openAI = new OpenAIApi(
  new Configuration({
    basePath:
      'https://kevinn-openai.openai.azure.com/openai/deployments/gpt_35_turbo',
  }),
)

;(async () => {
  while (true) {
    const userInput = await input({
      message: 'You: ',
    })
    console.log(userInput)

    const chatCompletion = await openAI.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              '你是一位懂中文且有用的 AI 助手，接下來請你以「繁體中文」與我對話。',
          },
          {
            role: 'user',
            content: userInput,
          },
        ],
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

    console.log(
      'chatCompletion: ',
      chatCompletion.data.choices[0].message?.content,
    )
  }
})()
