import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useBgStore = defineStore('bg', () => {
  const bgStyle = ref({})
  return { bgStyle }
})
