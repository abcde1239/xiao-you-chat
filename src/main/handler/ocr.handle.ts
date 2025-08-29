import { ipcMain } from 'electron'
import { createWorker } from 'tesseract.js'
import path from 'path'

export function registerOcrHandler(): void {
  ipcMain.handle('ask-for-ocr', async (_event, url: string, lang: string) => {
    // 动态判断是开发环境还是生产环境
    const isDevelopment = process.env.NODE_ENV === 'development'

    // 根据环境选择正确的 resources 路径
    const resourcesPath = isDevelopment
      ? path.join(__dirname, '../../resources') // 开发环境
      : process.resourcesPath // 生产环境

    const worker = await createWorker(lang, 1, {
      langPath: path.join(resourcesPath, 'tessdata')
    })
    const ret = await worker.recognize(url)
    await worker.terminate()
    console.log('data', ret.data)
    console.log('text', ret.data.text)
    return ret.data.text
  })
}
