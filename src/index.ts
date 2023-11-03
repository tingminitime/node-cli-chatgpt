import { spawn } from 'child_process'
import { select } from '@inquirer/prompts'
import chalk from 'chalk'
import { exitHint } from './constants/index.ts'

const answer = await select({
  message: 'Select a script to run',
  choices: [
    {
      name: 'openai',
      value: `tsx ./src/openai.ts`,
      description: 'Run OpenAI API',
    },
    {
      name: 'openai:stream',
      value: `tsx ./src/openai-stream.ts`,
      description: 'Run OpenAI API with stream',
    },
  ],
})

console.log(chalk.cyan.bold(exitHint))

spawn(answer, { stdio: 'inherit', shell: true })
