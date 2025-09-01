import { IDatabaseAPI } from './db/index.js'
import { IApiKeyAPI } from './apiKeyAPI.js'
import { IDeepSeekAPI } from './deepSeekAPI.js'
import { IDialogAPI } from './dialogAPI.d.ts'
import { IBackgroundAPI } from './backgroundAPI.js'
import { IPetAPI } from './petApi.js'
import { IOcrAPI } from './ocrAPI.js'
import { IScreenshotAPI } from './screenshotAPI.js'

declare global {
  interface Window {
    api: {
      backgroundAPI: IBackgroundAPI
      apiKeyAPI: IApiKeyAPI
      deepSeekAPI: IDeepSeekAPI
      dialogAPI: IDialogAPI
      databaseAPI: IDatabaseAPI
      petAPI: IPetAPI
      ocrAPI: IOcrAPI
      screenshotAPI: IScreenshotAPI
    }
    electron: typeof import('@electron-toolkit/preload').electronAPI
  }
}
export {}
