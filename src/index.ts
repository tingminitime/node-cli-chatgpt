import { spawn } from 'child_process'
import { select, Separator } from '@inquirer/prompts'

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
      name: 'openai-azure',
      value: `${tsNodeEsm} ./src/openai-azure.ts`,
      description: 'Run Azure OpenAI API',
    },
    {
      name: 'openai:stream',
      value: `${tsNodeEsm} ./src/openai-stream.ts`,
      description: 'Run OpenAI API with stream',
    },
    {
      name: 'openai-azure:stream (need fix)',
      value: `${tsNodeEsm} ./src/openai-azure-stream.ts`,
      description: 'Run Azure OpenAI API with stream',
    },
    new Separator(),
    {
      name: 'azure',
      value: `${tsNodeEsm} ./src/azure.ts`,
      description: 'Run Azure API',
    },
    {
      name: 'azure:stream',
      value: `${tsNodeEsm} ./src/azure-stream.ts`,
      description: 'Run Azure API with stream',
    },
    {
      name: 'azure:stream-loop',
      value: `${tsNodeEsm} ./src/azure-stream-loop.ts`,
      description: 'Run Azure API with loop stream',
    },
  ],
})

spawn(answer, { stdio: 'inherit', shell: true })
