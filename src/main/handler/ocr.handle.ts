import { ipcMain } from 'electron'
import { createWorker } from 'tesseract.js'

export function registerOcrHandler(): void {
  ipcMain.handle('ask-for-ocr', async (_event, url: string, lang: string) => {
    const worker = await createWorker(lang)
    const ret = await worker.recognize(url)
    console.log(ret.data.text)
    await worker.terminate()
  })
}
