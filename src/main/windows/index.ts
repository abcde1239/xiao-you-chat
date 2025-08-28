// windowManager.ts
import { BrowserWindow } from 'electron'
import { createMainWindow } from './mainWindow.js'
import { createPetWindow } from './petWindow.js'
import { AppTray } from './tray.js'
import { getIsQuiting } from '../state/index.js'

class WindowManager {
  private mainWindow: BrowserWindow | null = null
  private petWindow: BrowserWindow | null = null
  private tray: AppTray | null = null

  initWindows(): void {
    // 1. 创建窗口
    this.petWindow = createPetWindow()
    this.mainWindow = createMainWindow()

    // 2. mainWindow 关闭时显示 petWindow
    this.mainWindow.on('close', (e) => {
      if (!getIsQuiting()) {
        e.preventDefault()
        this.mainWindow?.hide()
        if (this.petWindow && !this.petWindow.isVisible()) {
          this.petWindow.show()
        }
      }
    })
    this.petWindow.on('close', (e) => {
      if (!getIsQuiting()) {
        e.preventDefault()
        this.petWindow?.hide()
        if (this.mainWindow && !this.mainWindow.isVisible()) {
          this.mainWindow.show()
        }
      }
    })

    // 3. 初始化托盘
    if (this.mainWindow && this.petWindow) {
      this.tray = new AppTray(this.mainWindow, this.petWindow)
      this.tray.createTray()
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getWindow(type: 'main' | 'pet') {
    if (type === 'main') return this.mainWindow
    if (type === 'pet') return this.petWindow
    return null
  }
}
export const windowManager = new WindowManager()
