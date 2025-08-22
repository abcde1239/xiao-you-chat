import { ipcRenderer } from 'electron'

export const backgroundAPI = {
  update: (bg: string) => {
    ipcRenderer.send('update-background', bg)
  },
  onSet: () => {
    const bg = ipcRenderer.invoke('set-background')
    return bg
  }
}
