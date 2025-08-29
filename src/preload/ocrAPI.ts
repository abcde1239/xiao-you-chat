import { ipcRenderer } from 'electron'

export const ocrAPI = {
  ask: (url: string, lang: string) => {
    ipcRenderer.invoke('ask-for-ocr', url, lang)
  }
}
