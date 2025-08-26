import { defineStore } from 'pinia'

export const useDeepSeekStore = defineStore('ai', {
  state: () => ({
    answer: '',
    loading: false,
    error: '',
    isStopped: false,
    currentMessages: [] as { role: 'user' | 'assistant'; content: string }[],
    currentSessionId: 0
  }),
  actions: {
    async ask(prompt: string) {
      this.loading = true
      this.error = ''
      this.isStopped = false

      // 先记录用户消息
      this.addMessage('user', prompt)
      this.answer = ''
      const currentAssistantIndex = this.currentMessages.length

      try {
        // 清理旧 SSE 回调，避免重复注册
        window.api.deepSeekAPI.clearOnAnswer?.()

        // 注册 SSE 回调
        window.api.deepSeekAPI.onAnswer((chunk: string) => {
          if (this.isStopped) return

          try {
            const json = JSON.parse(chunk)
            const text = json.choices?.[0]?.delta?.content || ''
            this.answer += text

            if (!this.currentMessages[currentAssistantIndex]) {
              this.addMessage('assistant', text)
            } else {
              this.currentMessages[currentAssistantIndex].content += text
            }
          } catch (err) {
            console.error('解析 SSE chunk 出错:', err, chunk)
          }
        })

        // 发起请求
        await window.api.deepSeekAPI.ask(prompt)
      } catch (err) {
        this.error =
          typeof err === 'string' ? err : err instanceof Error ? err.message : String(err)
      } finally {
        this.loading = false
        const lastMessage = this.currentMessages.at(-1)
        if (lastMessage) {
          window.api.databaseAPI.Message.add(
            this.currentSessionId,
            lastMessage.role,
            lastMessage.content
          )
        }
      }
    },
    stopAnswer() {
      this.isStopped = true
      window.api.deepSeekAPI.stopAnswer()
      this.loading = false
      // 清理 SSE 回调
      window.api.deepSeekAPI.clearOnAnswer?.()
    },
    addMessage(role: 'user' | 'assistant', content: string) {
      this.currentMessages.push({ role, content })
      if (role === 'user') {
        console.log('add:', this.currentSessionId, role, content)
        window.api.databaseAPI.Message.add(this.currentSessionId, role, content)
      }
    },
    clearMessages() {
      this.currentMessages = []
    },
    async updateCurrent(session_id: number) {
      this.currentSessionId = session_id
      const messages = await window.api.databaseAPI.Message.listBySession(session_id)
      this.currentMessages = messages
      console.log('更新后currentMessages:', this.currentMessages)
    }
  }
})
