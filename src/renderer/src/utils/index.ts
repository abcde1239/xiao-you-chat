import { BrowserWindow } from 'electron'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function ProxySSEToRender(response: Response, win: BrowserWindow, channel: string) {
  try {
    if (!response.body) {
      throw new Error('Response body is null')
    }
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { value, done } = await reader.read()
      if (done) {
        console.log('SSE proxy done')
        break
      }
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() || ''
      for (const part of parts) {
        if (part.startsWith('data:')) {
          const data = part.slice(5).trim()
          win.webContents.send(channel, data)
        }
      }
    }
  } catch (error) {
    console.error('SSE proxy error', error)
  }
}
