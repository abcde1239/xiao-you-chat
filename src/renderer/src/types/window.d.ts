import { IDatabaseAPI } from './db/index.js'
import { IApiKeyAPI } from './apiKeyAPI.js'
import { IDeepSeekAPI } from './deepSeekAPI.js'
import { IDialogAPI } from './dialogAPI.d.ts'
import { IBackgroundAPI } from './backgroundAPI.js'

declare global {
  interface Window {
    api: {
      backgroundAPI: IBackgroundAPI
      apiKeyAPI: IApiKeyAPI
      deepSeekAPI: IDeepSeekAPI
      dialogAPI: IDialogAPI
      databaseAPI: IDatabaseAPI
    }
    electron: typeof import('@electron-toolkit/preload').electronAPI
  }
}
export {}
