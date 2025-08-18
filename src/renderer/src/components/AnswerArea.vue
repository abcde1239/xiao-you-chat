<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="answer-show fade-in-text" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { useDeepSeekStore } from '../stores/deepseek'
import { computed, watch, ref, nextTick, onMounted } from 'vue'
const DeepSeekStore = useDeepSeekStore()
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
const emit = defineEmits(['change:height'])
const renderedHtml = computed(() => {
  return md.render(DeepSeekStore.answer)
})
const answerRef = ref<HTMLElement | null>(null)
const updateHeight = (): void => {
  if (answerRef.value) {
    const height = answerRef.value.scrollHeight
    emit('change:height', height)
  }
}
onMounted(() => {
  nextTick(updateHeight)
})
watch(
  () => DeepSeekStore,
  () => {
    nextTick(updateHeight)
  }
)
</script>

<style scoped>
.answer-show {
  padding-top: 1rem;
  padding-left: 0.5rem;
  padding-bottom: 0.5rem;
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
</style>
