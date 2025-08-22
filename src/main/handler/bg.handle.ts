import { ipcMain } from 'electron'

export function registerBgHandler(bg: string): void {
  ipcMain.handle('set-background', () => {
    return bg
  })
}
