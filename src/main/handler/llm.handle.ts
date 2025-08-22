import { BrowserWindow, ipcMain } from 'electron'
/* import axios from 'axios' */
import { ProxySSEToRender } from '../../renderer/src/utils/index.js'
export function registerDeepSeekHandler(mainWindow: BrowserWindow, apiKey): void {
  /*   ipcMain.handle('deepseek:ask', async (_event, prompt: string) => {
    try {
      const { data } = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.DeepSeek_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(data)
      return data.choices[0].message.content
    } catch (error) {
      console.error('调用失败')
      throw error
    }
  }) */
  ipcMain.handle('deepseek:ask', async (_event, prompt) => {
    console.log(apiKey)
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        stream: true
      })
    })
    await ProxySSEToRender(response, mainWindow, 'answer:deepseek')
  })
}
