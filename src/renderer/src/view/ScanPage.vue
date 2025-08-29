<template>
  <div class="scan-page">
    <div class="submit-area">
      <div class="select-area">
        <n-select v-model:value="lang" :options="langOptions"></n-select>
      </div>
      <drag-img-input @upload-file="handleUploadFile"></drag-img-input>
      <div class="preview-area">
        <img v-if="img" :src="img" alt="preview-img" />
        <div v-else>预览图片,也许什么都没有</div>
      </div>
      <div class="btn-area">
        <n-button class="cancel-btn" @click="handleCancel"
          ><n-icon size="24"> <backspace /></n-icon
        ></n-button>
        <n-button class="upload-btn" @click="handleOcrUpload"
          ><n-icon size="24"> <table-import /></n-icon
        ></n-button>
      </div>
    </div>
    <div class="result-area">
      <div v-if="result" class="result-show">
        <div class="title">扫描结果</div>
        <div>{{ result }}</div>
      </div>
      <div v-else class="preview-result">
        <img
          v-if="isLoading"
          src="../public/loading.gif"
          alt="loading"
          class="loading-spinner-img"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NIcon, NButton, useMessage, NSelect } from 'naive-ui'
import { TableImport, Backspace } from '@vicons/tabler'
import DragImgInput from '../components/DragImgInput.vue'
import { ref } from 'vue'
const img = ref('')
const message = useMessage()
const lang = ref('chi_sim')
const isLoading = ref(false)
const langOptions = [
  { label: '简体中文', value: 'chi_sim' },
  { label: 'English', value: 'eng' },
  { label: '日本語', value: 'jpn' }
]
const result = ref('')
const handleOcrUpload = async (): Promise<void> => {
  if (img.value) {
    try {
      result.value = ''
      isLoading.value = true
      result.value = await window.api.ocrAPI.ask(img.value, lang.value)
      if (result.value) {
        console.log(result.value)
        message.success('文字提取完成')
      }
    } catch (error) {
      message.error(String(error))
    } finally {
      isLoading.value = false
    }
  } else {
    message.warning(' 未上传文件')
  }
}
const handleUploadFile = (base64: string): void => {
  img.value = base64
  message.success('上传完成')
}
const handleCancel = (): void => {
  img.value = ''
  message.info('撤回图片')
}
</script>

<style scoped>
.scan-page {
  height: 100%;
  width: 100%;
  display: flex;
}
.submit-area {
  position: relative;
  display: flex;
  top: 5%;
  left: 10%;
  width: 40%;
  height: 90%;
  color: rgba(104, 98, 98, 0.9);
  backdrop-filter: blur(6px);
  flex-direction: column;
}
.select-area {
  width: 6rem;
}
.btn-area {
  display: flex;
  padding: 1%;
  width: 100%;
  justify-content: space-between;
}
.btn-area n-button {
  backdrop-filter: blur(6px);
  margin: 1rem;
  border-radius: 1rem;
}
.preview-area {
  width: 100%;
  height: 35%;
  padding-bottom: 1%;
  padding-top: 5%;
  text-align: center;
  border: 0.1875rem dashed #ccc;
  border-radius: 0.5rem;
}
.preview-area img {
  max-width: 100%; /* 不超过容器宽度 */
  max-height: 100%; /* 不超过容器高度 */
  object-fit: contain; /* 按比例缩放，完整显示 */
}
.result-area {
  position: relative;
  display: flex;
  top: 5%;
  left: 15%;
  width: 40%;
  height: 90%;
  color: rgba(104, 98, 98, 0.9);
  backdrop-filter: blur(6px);
  user-select: text;
}
.loading-spinner-img {
  display: block;
  margin: 0.5rem auto;
  width: 5rem;
  height: 5rem;
  mix-blend-mode: lighten;
}
.preview-result {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
