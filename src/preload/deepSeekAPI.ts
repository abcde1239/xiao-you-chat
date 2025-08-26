import { ipcRenderer } from 'electron'

let answerCallback: ((chunk: string) => void) | null = null
let answerListener: ((event, chunk: string) => void) | null = null

export const deepSeekAPI = {
  ask: (prompt: string): Promise<string> => {
    return ipcRenderer.invoke('deepseek:ask', prompt)
  },

  onAnswer: (callback: (chunk: string) => void) => {
    // 清理上一次监听
    if (answerListener) {
      ipcRenderer.removeListener('answer:deepseek', answerListener)
    }

    answerCallback = callback

    // 包装回调，方便后续移除
    answerListener = (_event, chunk: string) => {
      if (answerCallback) answerCallback(chunk)
    }

    ipcRenderer.on('answer:deepseek', answerListener)
  },

  clearOnAnswer: () => {
    if (answerListener) {
      ipcRenderer.removeListener('answer:deepseek', answerListener)
      answerListener = null
      answerCallback = null
    }
  },

  stopAnswer: () => {
    ipcRenderer.invoke('deepseek:stopAnswer')
    // 同时清理回调，防止 chunk 更新 UI
    deepSeekAPI.clearOnAnswer()
  }
}
