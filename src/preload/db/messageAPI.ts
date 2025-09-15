import { ipcRenderer } from 'electron'

export const Message = {
  add: async (sessionId: number, role: 'user' | 'assistant', content: string) => {
    const res = await ipcRenderer.invoke('db:addMessage', sessionId, role, content)
    if (res.ok) {
      return res.data
    } else {
      console.error(res.error.message, res.error.cause)
      return 0
    }
  },
  delete: (id: number) => {
    return ipcRenderer.invoke('db:deleteMessage', id)
  },
  listBySession: async (sessionId: number) => {
    const res = await ipcRenderer.invoke('db:listMessages', sessionId)
    if (res.ok) {
      const result = res.data.map((message) => ({
        role: message.role,
        content: message.content
      }))
      return result
    } else {
      console.error(res.error.message, res.error.cause)
      return []
    }
  }
}
