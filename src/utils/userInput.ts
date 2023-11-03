import { input } from '@inquirer/prompts'
import chalk from 'chalk'

type UserInputHandler = {
  userInput: string
  isInputExit: boolean
}

export async function userInputHandler(): Promise<UserInputHandler> {
  const userInput = await input({
    message: chalk.blue('You: '),
  })

  const isInputExit = userInput.toLowerCase() === 'exit'

  return {
    userInput,
    isInputExit,
  }
}
