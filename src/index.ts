import { spawn } from 'child_process'
import { select } from '@inquirer/prompts'
import chalk from 'chalk'
import { exitHint } from './constants/index.ts'

console.log('NODE_ENV:', process.env.NODE_ENV)

const runCommand = process.env.NODE_ENV === 'production' ? 'node' : 'tsx'

const answer = await select({
  message: 'Select a script to run',
  choices: [
    {
      name: 'openai',
      value: `${runCommand} ./src/openai.ts`,
      description: 'Run OpenAI API',
    },
    {
      name: 'openai:stream',
      value: `${runCommand} ./src/openai-stream.ts`,
      description: 'Run OpenAI API with stream',
    },
  ],
})

console.log(chalk.cyan.bold(exitHint))

spawn(answer, { stdio: 'inherit', shell: true })
