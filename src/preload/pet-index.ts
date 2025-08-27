import { contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    petAPI: {
      showAnimation: (name: string) => void
      onClick: (callback: () => void) => void
    }
  }
}

contextBridge.exposeInMainWorld('petAPI', {
  showAnimation: (name: string) => ipcRenderer.send('pet-show-animation', name),
  onClick: (callback: () => void) => {
    ipcRenderer.on('pet-click', callback)
  }
})
