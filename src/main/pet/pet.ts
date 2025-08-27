import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { isQuiting, setQuiting } from '../index.js'
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
          if (!isQuiting) {
            setQuiting(true)
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
