import { defineStore } from 'pinia'

declare global {
  interface Window {
    api: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      answerByDeepSeek(callback: (chunk: string) => void): any
      askDeepSeek(prompt: string): Promise<string>
      openFileDialog(): () => void
      onSetBackground: (callback: (bg: string) => void) => void
      updateBackground: (bg: string) => void

      onSetApiKey: (callback: (key?: string) => void) => void
      updateApiKey: (key: string) => void
    }
  }
}

export const useDeepSeekStore = defineStore('ai', {
  state: () => ({
    answer: '',
    loading: false,
    error: ''
  }),
  actions: {
    async ask(prompt: string) {
      this.loading = true
      this.error = ''
      this.answer = ''

      try {
        // 注册回调接收实时 SSE
        window.api.answerByDeepSeek((chunk: string) => {
          const json = JSON.parse(chunk)
          const text = json.choices?.[0]?.delta?.content || ''
          this.answer += text
        })

        // 发起请求
        await window.api.askDeepSeek(prompt)

        // 请求完成后 this.answer 已经是完整内容
      } catch (error) {
        this.error =
          typeof error === 'string' ? error : error instanceof Error ? error.message : String(error)
      } finally {
        this.loading = false
      }
    }
  }
})
