import { ipcRenderer } from 'electron'

export const backgroundAPI = {
  onSet: (callback: (bg: string) => void) => {
    ipcRenderer.on('set-background', (_event, bg) => callback(bg))
  },
  update: (bg: string) => {
    ipcRenderer.send('update-background', bg)
  }
}
