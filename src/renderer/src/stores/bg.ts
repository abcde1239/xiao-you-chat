import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useBgStore = defineStore('bg', {
  state: () => ({ bgStyle: ref({}), isSetBg: false, bgValue: '' })
})
