import { ipcMain } from 'electron'

export function registerApiKeyHandler(apiKey: string): void {
  ipcMain.handle('set-apiKey', () => {
    return apiKey
  })
}
