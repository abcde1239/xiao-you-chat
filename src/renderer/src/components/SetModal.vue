<template>
  <NModal
    :show="props.showModal"
    preset="dialog"
    title="ApiKey设置"
    positive-text="确认"
    negative-text="取消"
    @update:show="(value) => emit('update:showModal', value)"
    @positive-click="updateApiKey"
  >
    <div class="apikey-show">目前的apikey为: {{ yourKey }}</div>
    <NInput v-model:value="inputValue" placeholder="设置你的apikey"></NInput>
    <div class="apikey-ps">PS:设置完后记得重启</div>
  </NModal>
</template>

<script setup lang="ts">
import { NModal, NInput } from 'naive-ui'
import { onMounted, ref } from 'vue'
const yourKey = ref('')
const props = defineProps<{ showModal: boolean }>()
const emit = defineEmits<{ (e: 'update:showModal', value: boolean): void }>()
const inputValue = ref('')
onMounted(() => {
  if (window.api) {
    window.api.onSetApiKey((key) => {
      if (key) {
        yourKey.value = key
      } else {
        yourKey.value = '未设置'
      }
    })
  } else {
    console.warn('window.api is undefined')
  }
})
const updateApiKey = (): void => {
  if (inputValue.value) {
    window.api.updateApiKey(inputValue.value)
    yourKey.value = inputValue.value
  }
}
</script>
<style>
.apikey-show {
  padding-top: 3%;
  padding-bottom: 3%;
  user-select: text;
}
.apikey-ps {
  font-size: 12px;
  color: #666;
  padding-top: 3%;
  padding-bottom: 3%;
}
</style>
