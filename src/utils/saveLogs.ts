import {
  writeFile,
  readFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import Message from '@/types/message.js'

const logsFolderPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../logs',
)

function formatCurrentDateTime() {
  const d = new Date()
  const date = d.toISOString().split('T')[0]
  const time = d.toTimeString().split(' ')[0].split(':').join('')
  const dateTime = `${date}_${time}`
  return dateTime
}

function generateLogFileName() {
  return `message-history.json`
}

function readMessagesHistory(
  filePath: string,
): Array<Message & { time: string }> {
  try {
    const data = readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(error)
    return []
  }
}

function writeMessageHistory(filePath: string, messagesHistory: Message[]) {
  const logData = JSON.stringify(messagesHistory, null, 2)
  writeFileSync(filePath, logData, 'utf-8')
}

export default function recordMessagesHistory(message?: Message) {
  if (!message) return
  if (!existsSync(logsFolderPath)) {
    mkdirSync(logsFolderPath)
  }

  const logFileName = generateLogFileName()
  const logFilePath = resolve(logsFolderPath, logFileName)

  if (!existsSync(logFilePath)) {
    writeFileSync(logFilePath, '[]', 'utf-8')
    return
  }

  const messagesHistory = readMessagesHistory(logFilePath)
  messagesHistory.push({
    ...message,
    time: new Date().toLocaleString('en-US'),
  })

  writeMessageHistory(logFilePath, messagesHistory)
}
