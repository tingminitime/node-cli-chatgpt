import type Message from '@/types/message'

function messageHandler() {
  const initMessages: Message[] = [
    {
      role: 'system',
      content:
        '你是一位懂中文且有用的 AI 助手，接下來請你以「繁體中文」與我對話。',
    },
  ]

  const addMessage = (
    messages: Message[],
    role: Message['role'],
    content: Message['content'],
  ) => {
    messages.push({
      role,
      content,
    })

    return messages
  }

  return {
    initMessages,
    addMessage,
  }
}

export default messageHandler
