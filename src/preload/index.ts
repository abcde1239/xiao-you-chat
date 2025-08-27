import { backgroundAPI } from './backgroundAPI.js'
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { apiKeyAPI } from './apiKeyAPI.js'
import { deepSeekAPI } from './deepSeekAPI.js'
import { dialogAPI } from './dialogAPI.js'
import { databaseAPI } from './db/index.js'
import { petAPI } from './petAPI.js'
console.log('Preload loaded')

const api = {
  backgroundAPI,
  apiKeyAPI,
  dialogAPI,
  deepSeekAPI,
  databaseAPI,
  petAPI
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    console.log(api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
