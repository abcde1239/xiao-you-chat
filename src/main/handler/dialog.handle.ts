import { dialog, ipcMain } from 'electron'
export function DialogOpenFileHandler(): void {
  ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif'] }]
    })
    if (canceled) {
      return null
    } else {
      return filePaths[0]
    }
  })
}
