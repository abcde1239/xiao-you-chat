import { ipcRenderer } from 'electron'

export const Message = {
  add: (sessionId: number, role: 'user' | 'assistant', content: string) => {
    return ipcRenderer.invoke('db:addMessage', sessionId, role, content)
  },
  delete: (id: number) => {
    return ipcRenderer.invoke('db:deleteMessage', id)
  },
  listBySession: (sessionId: number) => {
    return ipcRenderer.invoke('db:listMessage', sessionId)
  }
}
