<template>
  <div class="setBgButton">
    <n-button class="btn" round @click="selectImage">
      <n-icon size="25">
        <photo />
      </n-icon>
    </n-button>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import Photo from '@vicons/tabler/Photo'

const fileInput = ref<HTMLInputElement | null>(null)
const emit = defineEmits(['update:bg'])
function selectImage(): void {
  fileInput.value?.click()
}

function handleFileChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const base64 = reader.result as string
    emit('update:bg', base64)
    window.api.backgroundAPI.update(base64)
    console.log(base64)
  }
  reader.readAsDataURL(file)
}
</script>
<style scoped>
.setBgButton {
  display: inline-flex;
  background: rgba(255 255 255 / 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin-top: 2%;
}
</style>
