<template>
  <div
    class="drag-drop-area"
    :class="{ hover: isHover }"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <p>将文件拖拽到此处上传</p>
    <input ref="fileInput" type="file" style="display: none" @change="onFileSelect" />
    <n-button @click="triggerFileSelect">或点击选择文件</n-button>
  </div>
</template>

<script setup lang="ts">
import { useMessage, NButton } from 'naive-ui'
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const isHover = ref(false)
const message = useMessage()
const triggerFileSelect = (): void => {
  fileInput.value?.click()
}

const onFileSelect = (e: Event): void => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  handleFiles(target.files)
}

const onDragOver = (): void => {
  isHover.value = true
}

const onDragLeave = (): void => {
  isHover.value = false
}

const onDrop = (e: DragEvent): void => {
  isHover.value = false
  if (!e.dataTransfer?.files) return
  handleFiles(e.dataTransfer.files)
}
const emit = defineEmits(['uploadFile'])

const handleFiles = (files: FileList): void => {
  const fileArray = Array.from(files)
  fileArray.forEach((file) => {
    //  文件类型校验
    if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
      message.error('请传输 jpeg 或 png 格式的文件')
      return
    }

    const reader = new FileReader()
    const base64 = { value: '' }

    reader.onload = () => {
      base64.value = reader.result as string
      console.log('Base64 转换结果:', base64.value)
      emit('uploadFile', base64.value)
      console.log('上传文件:', file.name)
      let text = '上传文件 ' + file.name + '中'
      message.info(text)
    }

    reader.readAsDataURL(file)
  })
}
</script>

<style scoped>
.drag-drop-area {
  width: 100%;
  height: 60%;
  border-radius: 0.625rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background 0.3s;
  text-align: center;
  border: 0.1875rem dashed #ccc;
}
.drag-drop-area.hover {
  background: rgba(0, 123, 255, 0.1); /* 淡蓝色背景 */
  border-color: #007bff; /* 蓝色边框 */
  box-shadow: 0 0 1rem rgba(0, 123, 255, 0.4); /* 发光效果 */
  transition: all 0.3s ease;
}

.drag-drop-area button {
  margin-top: 0.625rem;
  padding: 0.3125rem 0.625rem;
  border-radius: 0.3125rem;
  cursor: pointer;
}
</style>
