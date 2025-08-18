import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
console.log('Preload loaded')
// Custom APIs for renderer
/**
 * @param callback 回调函数，接收背景字符串
 * @param bg 背景值（颜色或图片）
 **/
let answerCallback: ((chunk: string) => void) | null = null
const api = {
  onSetBackground: (callback: (bg: string) => void) => {
    ipcRenderer.on('set-background', (_event, bg) => callback(bg))
  },
  onSetApiKey: (callback: (key?: string) => void) => {
    ipcRenderer.on('set-apikey', (_event, key?: string) => callback(key))
  },
  updateBackground: (bg: string) => {
    ipcRenderer.send('update-background', bg)
  },
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  askDeepSeek: async (prompt: string) => {
    ipcRenderer.invoke('deepseek:ask', prompt)
  },
  answerByDeepSeek: (callback: (chunk: string) => void) => {
    answerCallback = callback

    // 移除已有监听，防止重复注册
    ipcRenderer.removeAllListeners('answer:deepseek')
    ipcRenderer.on('answer:deepseek', (_event, chunk: string) => {
      if (answerCallback) answerCallback(chunk)
    })
  },
  updateApiKey: (key: string) => {
    ipcRenderer.send('update-apiKey', key)
  }
  /*   askForApiKey: () => {
    ipcRenderer.send('ask-for-apikey')
  } */
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
