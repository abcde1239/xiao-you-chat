import { BrowserWindow, ipcMain, Menu, app } from 'electron'
import { getIsQuiting, setIsQuiting } from '../state/index.js'

export function registerPetContextMenu(petWindow: BrowserWindow, mainWindow: BrowserWindow): void {
  ipcMain.on('pet-contextmenu', () => {
    if (!petWindow) return

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示主界面',
        click: () => {
          mainWindow.show()
          mainWindow.focus()
        }
      },
      {
        label: '隐藏桌宠',
        click: () => {
          if (petWindow.isVisible()) {
            petWindow.hide()
          }
        }
      },
      {
        label: '退出',
        click: () => {
          if (!getIsQuiting()) {
            setIsQuiting(true)
            app.quit()
          }
        }
      }
    ])

    contextMenu.popup({
      window: petWindow
    })
  })
}
