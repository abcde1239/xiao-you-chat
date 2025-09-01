import { globalShortcut } from 'electron/main'
import { createScreenshotWindow } from '../windows/screenshotWindow.js'
import { BrowserWindow } from 'electron'

export async function registerScreenshotHandler(mainWin: BrowserWindow): Promise<void> {
  const ret = globalShortcut.register('F2', () => {
    console.log('F2')
    createScreenshotWindow(mainWin)
  })
  if (!ret) {
    console.log('快捷键注册失败')
  }
}
