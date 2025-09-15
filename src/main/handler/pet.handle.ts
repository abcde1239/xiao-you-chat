import { BrowserWindow, ipcMain } from 'electron'
export function registerPetHandler(petWindow: BrowserWindow, mainWindow: BrowserWindow): void {
  ipcMain.on('pet-move', (_event, { dx, dy }) => {
    if (petWindow) {
      const bounds = petWindow.getBounds()
      petWindow.setBounds({
        x: bounds.x + dx,
        y: bounds.y + dy,
        width: bounds.width,
        height: bounds.height
      })
    }
  })
  ipcMain.on('show-main', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })
}
