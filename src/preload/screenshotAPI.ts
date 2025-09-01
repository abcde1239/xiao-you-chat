import { ipcRenderer } from 'electron'

export const screenshotAPI = {
  start: (): Promise<string> => {
    return new Promise((resolve) => {
      ipcRenderer.once('screen-capture', (_event, base64: string) => {
        resolve('data:image/png;base64,' + base64)
      })
    })
  },
  save: (selection: { x: number; y: number; width: number; height: number }) => {
    console.log(selection)
    ipcRenderer.send('snip-save', selection)
  },
  ocr: (selection: { x: number; y: number; width: number; height: number }) => {
    console.log(selection)
    ipcRenderer.send('snip-ocr', selection)
  },
  getOcr: (callback: (data: { img: string; route: string }) => void) => {
    ipcRenderer.on('get-screenshot-ocr', (_event, base64) => {
      console.log(base64)
      callback({ img: base64, route: '/scan' })
    })
  },
  close: () => ipcRenderer.send('snip-close')
}
