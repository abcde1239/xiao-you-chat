/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ipcMain } from 'electron'
import axios from 'axios'
import sharp from 'sharp'

function base64Size(base64: string) {
  const head = base64.indexOf(',') + 1
  const body = base64.slice(head)
  return Math.ceil((body.length * 3) / 4)
}
async function compressBase64(base64: string, maxWidth = 1024, quality = 70) {
  const buffer = Buffer.from(base64.split(',')[1], 'base64')
  const compressedBuffer = await sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality })
    .toBuffer()
  return `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`
}
export function registerOcrHandler() {
  ipcMain.handle('ask-for-ocr', async (_event, base64Image: string, lang: string = 'chs') => {
    try {
      let imageToUse = base64Image

      // 如果大于 1MB，自动压缩
      if (base64Size(base64Image) > 1 * 1024 * 1024) {
        imageToUse = await compressBase64(base64Image)
        console.log('图片大于1MB,已自动压缩')
      }

      // 调用 OCR.space API
      const formData = new URLSearchParams()
      formData.append('apikey', 'helloworld') // 免费测试key
      formData.append('base64Image', imageToUse)
      formData.append('language', lang)

      const res = await axios.post('https://api.ocr.space/parse/image', formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      const parsedText = res.data.ParsedResults?.[0]?.ParsedText || ''
   
      return parsedText
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('OCR.space 调用失败:', err)
      return { success: false, error: err.message || err }
    }
  })
}
