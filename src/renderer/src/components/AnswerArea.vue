<!-- eslint-disable vue/no-v-html -->
<template>
  <div ref="answerRef" class="answer-show fade-in-text"></div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { useDeepSeekStore } from '../stores/deepseek'
import { ref, watch, nextTick, onMounted } from 'vue'

const DeepSeekStore = useDeepSeekStore()
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const emit = defineEmits(['change:height'])
const answerRef = ref<HTMLElement | null>(null)

// 用一个 Map 记录每条消息对应的 DOM 元素,防止重复渲染
const messageDomMap = new Map<number, HTMLElement>()

const updateHeight = (): void => {
  if (answerRef.value) {
    const height = answerRef.value.scrollHeight
    emit('change:height', height)
  }
}

// 增量渲染并同步更新 AI 消息内容
const renderNewMessages = (): void => {
  if (!answerRef.value) return
  const messages = DeepSeekStore.messages

  messages.forEach((msg, index) => {
    const html = md.render(msg.content)

    if (!messageDomMap.has(index)) {
      // 新增消息，创建 DOM
      const div = document.createElement('div')
      div.innerHTML = html
      div.className = msg.role === 'user' ? 'message-user' : 'message-assistant'
      if (answerRef.value) {
        answerRef.value.appendChild(div)
      }
      messageDomMap.set(index, div)
    } else {
      // 已存在消息，更新内容（主要是流式 AI 消息）
      const div = messageDomMap.get(index)!
      div.innerHTML = html
    }
  })

  nextTick(updateHeight)
}

onMounted(() => {
  renderNewMessages()
})

// 深度监听 messages 数组，实时渲染新消息或更新 AI 内容
watch(
  () => DeepSeekStore.messages,
  () => {
    renderNewMessages()
  },
  { deep: true }
)
</script>

<style scoped>
.answer-show {
  padding-top: 0.3rem;
  padding-left: 0.5rem;
  padding-bottom: 0.5rem;
  width: 100%;
  overflow-y: auto;
  user-select: text;
}
.fade-in-text {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0.3;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.message-user) {
  padding: 0.3rem 0.5rem;
  border-radius: 12px;
  margin-bottom: 0.3rem;
  text-align: right;
}

:deep(.message-assistant) {
  padding: 0.3rem 0.5rem;
  border-radius: 12px;
  margin-bottom: 0.3rem;
  text-align: left;
}
</style>
