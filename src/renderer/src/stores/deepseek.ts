import { defineStore } from 'pinia'

export const useDeepSeekStore = defineStore('ai', {
  state: () => ({
    answer: '',
    loading: false,
    error: '',
    currentMessages: [] as { role: 'user' | 'assistant'; content: string }[],
    currentSessionId: 0
  }),
  actions: {
    async ask(prompt: string) {
      this.loading = true
      this.error = ''

      // 先记录用户消息
      this.addMessage('user', prompt)
      this.answer = ''
      try {
        // 当前 AI 消息的索引（可能还未创建）
        const currentAssistantIndex = this.currentMessages.length

        // 注册 SSE 回调
        window.api.deepSeekAPI.onAnswer((chunk: string) => {
          try {
            const json = JSON.parse(chunk)
            const text = json.choices?.[0]?.delta?.content || ''
            this.answer += text

            // 如果 AI 消息不存在，则创建一条新消息
            if (!this.currentMessages[currentAssistantIndex]) {
              this.addMessage('assistant', text)
            } else {
              // 否则追加到最后一条 AI 消息
              // 这里直接修改 content 保持响应式
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
        const { role, content } = this.currentMessages.at(-1) as {
          role: 'user' | 'assistant'
          content: string
        }
        window.api.databaseAPI.Message.add(this.currentSessionId, role, content)
      }
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
