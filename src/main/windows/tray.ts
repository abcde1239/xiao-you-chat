import { Tray, Menu, app, BrowserWindow } from 'electron'
import { join } from 'path'
import { setIsQuiting } from '../state/index.js'

export class AppTray {
  private tray: Tray | null = null

  constructor(
    private mainWindow: BrowserWindow,
    private petWindow: BrowserWindow
  ) {
    app.on('before-quit', () => {
      setIsQuiting(true)
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  createTray() {
    if (this.tray) return this.tray

    this.tray = new Tray(join(__dirname, '../../resources/xiaoyou.png'))
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示主界面',
        click: () => {
          this.mainWindow.show()
          this.petWindow.hide()
        }
      },
      {
        label: '显示桌宠',
        click: () => {
          if (!this.petWindow.isVisible()) {
            this.petWindow.show()
          }
        }
      },
      {
        label: '退出',
        click: () => {
          setIsQuiting(true)
          app.quit()
        }
      }
    ])

    this.tray.setToolTip('xiao-you-pet')
    this.tray.setContextMenu(contextMenu)

    this.tray.on('double-click', () => {
      this.mainWindow.show()
      this.petWindow.hide()
    })

    return this.tray
  }
}
