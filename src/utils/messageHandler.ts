import type Message from '@/types/message.ts'
import { systemPrompt } from '@/constants/index.ts'

type MessageHandlerConfig = {
  maxMessageHistory?: number
}

function messageHandler({ maxMessageHistory = 10 }: MessageHandlerConfig = {}) {
  /**
   * @description 初始聊天訊息
   */
  const messageHistory: Message[] = [
    {
      role: 'system',
      // content: '你是一位懂中文且有用的 AI 助手，接下來是一連串的聊天問答，請你以「繁體中文」與我對話。',
      content: systemPrompt,
    },
  ]

  const limitMessageHistory = (max: number) => {
    if (messageHistory.length > max) {
      messageHistory.shift()
    }
  }

  /**
   * 新增聊天訊息
   * @param messages 當前聊天訊息紀錄
   * @param role 角色
   * @param content 訊息內容
   * @returns 新的聊天訊息紀錄
   */
  const addMessage = (
    messages: Message[],
    role: Message['role'],
    content: Message['content'],
  ) => {
    messages.push({
      role,
      content,
    })

    limitMessageHistory(maxMessageHistory)

    return messages
  }

  return {
    messageHistory,
    addMessage,
  }
}

export default messageHandler
