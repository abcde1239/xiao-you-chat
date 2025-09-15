import { ipcRenderer } from 'electron'

export const ocrAPI = {
  ask: async (url: string, lang: string) => {
    const result = await ipcRenderer.invoke('ask-for-ocr', url, lang)
    return result
  }
}
