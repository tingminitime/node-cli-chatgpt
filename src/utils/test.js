import {
  writeFile,
  readFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

const logsFolderPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../logs',
)

function generateLogFileName() {
  return `message-history.json`
}

function readMessagesHistory(filePath) {
  try {
    const data = readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(error)
    return []
  }
}

function writeMessageHistory(filePath, messagesHistory) {
  const logData = JSON.stringify(messagesHistory, null, 2)
  writeFileSync(filePath, logData, 'utf-8')
}

console.log(logsFolderPath)

console.log(existsSync(logsFolderPath))

if (!existsSync(logsFolderPath)) {
  mkdirSync(logsFolderPath)
}

const logFileName = generateLogFileName()
const logFilePath = resolve(logsFolderPath, logFileName)
console.log(logFilePath)

if (!existsSync(logFilePath)) {
  writeFileSync(logFilePath, '[]')
} else {
  const messagesHistory = readMessagesHistory(logFilePath)
  messagesHistory.push('Hello')
  writeMessageHistory(logFilePath, messagesHistory)
}
