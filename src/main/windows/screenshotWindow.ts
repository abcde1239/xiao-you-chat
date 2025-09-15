import { is } from '@electron-toolkit/utils'
import { app, BrowserWindow, desktopCapturer, ipcMain, screen } from 'electron'
import { join } from 'path'
import { Jimp } from 'jimp'
import { existsSync, mkdirSync } from 'fs'
export function createScreenshotWindow(mainWin: BrowserWindow): BrowserWindow {
  const win = new BrowserWindow({
    transparent: true,
    alwaysOnTop: true,
    frame: false,
    fullscreen: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      contextIsolation: true
    }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/screenshot`)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/screenshot' })
  }
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.size
  const scaleFactor = primaryDisplay.scaleFactor
  let screenshot
  let fullScreenshotBuffer
  win.webContents.once('did-finish-load', async () => {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: Math.floor(width * scaleFactor),
        height: Math.floor(height * scaleFactor)
      }
    })
    screenshot = sources[0].thumbnail.toPNG()
    fullScreenshotBuffer = screenshot
    const base64 = screenshot.toString('base64')
    win.webContents.send('screen-capture', base64)
  })

  ipcMain.once(
    'snip-save',
    async (_event, rect: { x: number; y: number; width: number; height: number }) => {
      console.log(fullScreenshotBuffer)
      if (!fullScreenshotBuffer) return
      const img = await Jimp.read(fullScreenshotBuffer)
      const timestamp = Date.now()

      //  appData/MyApp/Screenshots
      const screenshotDir = join(app.getPath('userData'), 'Screenshots')
      if (!existsSync(screenshotDir)) {
        mkdirSync(screenshotDir, { recursive: true })
      }
      const cropped = img.crop({ x: rect.x, y: rect.y, w: rect.width, h: rect.height })
      await cropped.write(`${screenshotDir}/${timestamp}.png`)
      console.log('截图保存完成')
      win.close()
    }
  )
  ipcMain.once('snip-close', () => {
    if (win) {
      win.close()
    }
  })

  ipcMain.once(
    'snip-ocr',
    async (_event, rect: { x: number; y: number; width: number; height: number }) => {
      if (!fullScreenshotBuffer) return
      const img = await Jimp.read(fullScreenshotBuffer)
      const cropped = img.crop({ x: rect.x, y: rect.y, w: rect.width, h: rect.height })
      const base64 = await cropped.getBase64('image/png')
      mainWin.show()
      mainWin.webContents.send('get-screenshot-ocr', base64)
      win.close()
    }
  )
  return win
}
