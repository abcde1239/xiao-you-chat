import { ipcRenderer } from 'electron'

let answerCallback: ((chunk: string) => void) | null = null

export const deepSeekAPI = {
  ask: (prompt: string): Promise<string> => {
    return ipcRenderer.invoke('deepseek:ask', prompt)
  },
  onAnswer: (callback: (chunk: string) => void) => {
    answerCallback = callback
    ipcRenderer.removeAllListeners('answer:deepseek')
    ipcRenderer.on('answer:deepseek', (_event, chunk: string) => {
      if (answerCallback) answerCallback(chunk)
    })
  }
}
