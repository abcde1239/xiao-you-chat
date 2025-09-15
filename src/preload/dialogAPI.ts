import { ipcRenderer } from 'electron'

export const dialogAPI = {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
}
