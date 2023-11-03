import { spawn } from 'child_process'
import { select, Separator } from '@inquirer/prompts'
import chalk from 'chalk'

const tsNodeEsm =
  'node --experimental-specifier-resolution=node --experimental-modules --no-warnings --loader ts-node/esm'

const answer = await select({
  message: 'Select a script to run',
  choices: [
    {
      name: 'openai',
      value: `${tsNodeEsm} ./src/openai.ts`,
      description: 'Run OpenAI API',
    },
    {
      name: 'openai:stream',
      value: `${tsNodeEsm} ./src/openai-stream.ts`,
      description: 'Run OpenAI API with stream',
    },
  ],
})

console.log(chalk.cyan.bold('You can input "exit" to exit the chat'))

spawn(answer, { stdio: 'inherit', shell: true })
