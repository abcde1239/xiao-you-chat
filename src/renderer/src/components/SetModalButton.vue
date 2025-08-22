<template>
  <div class="setModalButton">
    <n-tooltip title="配置apiKey" placement="top">
      <template #default>
        <n-button class="btn" round @click="handleShowModalClick">
          <n-icon size="25">
            <key />
          </n-icon>
        </n-button>
      </template>
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import Key from '@vicons/tabler/Key'
import { NButton, NIcon } from 'naive-ui'
const emit = defineEmits<{ (e: 'show:modal', value: boolean): void }>()
const handleShowModalClick = (): void => {
  emit('show:modal', true)
}
</script>
<style scoped>
.setModalButton {
  display: inline-flex;
  background: rgba(255 255 255 / 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin-top: 2%;
  margin-right: 2%;
}
</style>
