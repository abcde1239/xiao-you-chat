import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import 'dotenv/config'
import {
  DialogOpenFileHandler,
  registerDeepSeekHandler,
  registerDBHandler,
  registerBgHandler,
  registerApiKeyHandler
} from './handler/index.js'
const configPath = join(app.getPath('userData'), 'config.json')
let mainWindow: BrowserWindow
const defaultConfig = {
  background: '#1e1e1e',
  apiKey: ''
}
if (!existsSync(configPath)) {
  writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function loadConfig() {
  if (existsSync(configPath)) {
    return JSON.parse(readFileSync(configPath, 'utf-8'))
  }
  return { background: '#1e1e1e', apiKey: '' }
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function saveConfig(data) {
  writeFileSync(configPath, JSON.stringify(data))
}
const winConfig = loadConfig()
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    icon: join(__dirname, '../../resources/xiaoyou.png'),
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      contextIsolation: true
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('忧来无方')
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  DialogOpenFileHandler()
  registerDBHandler()
  registerBgHandler(winConfig.background)
  registerApiKeyHandler(winConfig.apiKey)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC
  ipcMain.on('update-background', (_event, newBg) => {
    const config = loadConfig()
    config.background = newBg
    saveConfig(config)
  })
  ipcMain.on('update-apiKey', (_event, newKey) => {
    const config = loadConfig()
    config.apiKey = newKey
    saveConfig(config)
    winConfig.apiKey = newKey
    console.log('API Key updated and reloaded:', winConfig.apiKey)
  })

  createWindow()
  const window = BrowserWindow.getAllWindows()[0]
  registerDeepSeekHandler(window, loadConfig().apiKey)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
