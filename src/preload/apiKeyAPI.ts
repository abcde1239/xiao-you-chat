import { ipcRenderer } from 'electron'

export const apiKeyAPI = {
  /*   onSet: (callback: (key?: string) => void) => {
    ipcRenderer.on('set-apikey', (_event, key?: string) => callback(key))
  }, */
  update: (key: string) => {
    ipcRenderer.send('update-apiKey', key)
  },
  onSet: () => {
    const apiKey = ipcRenderer.invoke('set-apiKey')
    return apiKey
  }
}
