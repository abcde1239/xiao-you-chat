import { app, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { windowManager } from './windows/index.js'
import {
  registerDialogHandler,
  registerDeepSeekHandler,
  registerDBHandler,
  registerBgHandler,
  registerPetHandler,
  registerApiKeyHandler
} from './handler/index.js'

import { loadConfig, saveConfig, winConfig } from './config/index.js'
import { registerPetContextMenu } from './pet/index.js'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // 注册各类业务 handler
  registerDialogHandler()
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

  // 初始化窗口 & 托盘
  windowManager.initWindows()

  // 注册和窗口关联的 handler
  const mainWindow = windowManager.getWindow('main')
  const petWindow = windowManager.getWindow('pet')
  if (mainWindow && petWindow) {
    registerDeepSeekHandler(mainWindow, loadConfig().apiKey)

    registerPetHandler(petWindow, mainWindow)
    registerPetContextMenu(petWindow, mainWindow)
  }

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', function () {
    if (windowManager.getWindow('main') === undefined) {
      windowManager.initWindows()
    }
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
