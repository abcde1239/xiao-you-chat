<template>
  <div class="ask-input">
    <n-input
      v-model:value="inputValue"
      round
      placeholder="请输入你的问题"
      type="textarea"
      :disabled="active"
      :autosize="{
        minRows: 2
      }"
      @keyup.enter="handleSubmitClick"
    />
    <n-button class="submit-btn" size="small" round @click="handleSubmitClick"
      ><n-icon size="10"> <ArrowBarUp /> </n-icon
    ></n-button>
  </div>
</template>

<script setup lang="ts">
import { NInput, NButton, NIcon } from 'naive-ui'
import ArrowBarUp from '@vicons/tabler/ArrowBarUp'
import { useDeepSeekStore } from '../stores/deepseek'
import { computed, ref } from 'vue'
const inputValue = ref('')
const DeepSeekStore = useDeepSeekStore()
const emit = defineEmits(['submit:ask'])
const active = computed(() => DeepSeekStore.loading)
const handleSubmitClick = async (): Promise<void> => {
  emit('submit:ask')
  console.log('提问为：', inputValue.value)
  await DeepSeekStore.ask(inputValue.value)
  inputValue.value = ''
}
</script>

<style scoped>
.ask-input {
  position: relative;
  display: flex;
  flex: 1;
  background: rgba(255 255 255 / 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
::v-deep(.n-input) {
  background: rgba(255 255 255 / 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
::v-deep(.n-input textarea) {
  background: transparent !important;
  border: none !important;
  color: #fff;
  resize: none;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.2);
}
.submit-btn {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  z-index: 10;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
