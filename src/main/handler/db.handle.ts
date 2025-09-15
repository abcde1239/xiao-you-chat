// main/handles/db.handle.ts
import { ipcMain } from 'electron'
import { DB } from '../db/index.js'

export function registerDBHandler(): void {
  /** ===== Session 相关 ===== */
  ipcMain.handle('db:createSession', (_event, title: string) => {
    return DB.createSession(title)
  })

  ipcMain.handle('db:listSessions', () => {
    return DB.listSessions()
  })

  ipcMain.handle('db:deleteSession', (_event, id: number) => {
    return DB.deleteSession(id)
  })

  /** ===== Message 相关 ===== */
  ipcMain.handle(
    'db:addMessage',
    (_event, sessionId: number, role: 'user' | 'assistant', content: string) => {
      return DB.addMessage(sessionId, role, content)
    }
  )

  ipcMain.handle('db:listMessages', (_event, sessionId: number) => {
    return DB.listMessages(sessionId)
  })

  ipcMain.handle('db:deleteMessage', (_event, id: number) => {
    return DB.deleteMessage(id)
  })
}
