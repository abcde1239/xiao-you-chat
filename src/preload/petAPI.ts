import { ipcRenderer } from 'electron'

export const petAPI = {
  moveBy: (dx: number, dy: number) => ipcRenderer.send('pet-move', { dx, dy }),
  showMain: () => ipcRenderer.send('show-main'), //双击调动
  showContextMenu: () => {
    ipcRenderer.send('pet-contextmenu')
  }
}
