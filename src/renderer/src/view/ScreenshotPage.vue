<template>
  <div
    class="snip-overlay"
    @mousedown="startSelection"
    @mousemove="resizeSelection"
    @mouseup="finishSelection"
    @contextmenu="cancelSelection"
  >
    <!-- 截图背景 -->
    <img v-if="screenshot" :src="screenshot" class="screenshot" />

    <!-- 选区矩形 -->
    <div v-if="selecting || selection" class="selection-rect" :style="selectionStyle">
      <!-- 工具栏（在矩形右上角显示） -->
      <div v-if="selection" class="toolbar">
        <button class="btn ocr" @click.stop="ocrSelection">
          <n-icon size="15"><Scan /></n-icon>
        </button>
        <button class="btn confirm" @click.stop="confirmSelection">
          <n-icon size="15"><file /></n-icon>
        </button>
        <button class="btn cancel" @click.stop="cancelSelection">
          <n-icon size="15"><letterX /></n-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NIcon } from 'naive-ui'
/** 保存截图图像（主进程发来的 base64） */
const screenshot = ref<string | null>(null)
import { File, LetterX, Scan } from '@vicons/tabler'
/** 鼠标选择区域相关状态 */
const startX = ref(0)
const startY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const selecting = ref(false)
const selection = ref<{ x: number; y: number; width: number; height: number } | null>(null)

/** 开始拖拽 */
const startSelection = (e: MouseEvent): void => {
  if (e.button !== 0) return
  if (selection.value) return // 已经有选区时不能重新画
  selecting.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  currentX.value = e.clientX
  currentY.value = e.clientY
}

/** 拖拽过程中更新矩形 */
const resizeSelection = (e: MouseEvent): void => {
  if (!selecting.value) return
  currentX.value = e.clientX
  currentY.value = e.clientY
}

/** 拖拽结束，计算区域（但不立即发送） */
const finishSelection = (): void => {
  if (!selecting.value) return
  selecting.value = false
  selection.value = {
    x: Math.min(startX.value, currentX.value),
    y: Math.min(startY.value, currentY.value),
    width: Math.abs(startX.value - currentX.value),
    height: Math.abs(startY.value - currentY.value)
  }
}

/** 计算选区在截图原始像素坐标上的位置 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getSelectionOnImage = () => {
  if (!selection.value || !screenshot.value) return null

  const rect = selection.value
  const imgEl = document.querySelector('.screenshot') as HTMLImageElement
  if (!imgEl) return null

  // 图片在页面显示尺寸和原始截图像素尺寸的比例
  const scaleX = imgEl.naturalWidth / imgEl.clientWidth
  const scaleY = imgEl.naturalHeight / imgEl.clientHeight

  return {
    x: Math.round(rect.x * scaleX),
    y: Math.round(rect.y * scaleY),
    width: Math.round(rect.width * scaleX),
    height: Math.round(rect.height * scaleY)
  }
}

/** 点击确认，发送选区给主进程保存 */
const confirmSelection = (): void => {
  const realRect = getSelectionOnImage()
  if (!realRect) return
  console.log('发送给主进程保存:', realRect)
  window.api.screenshotAPI.save(realRect)
}

/** 点击 OCR，发送选区给主进程进行识别 */
const ocrSelection = (): void => {
  const realRect = getSelectionOnImage()
  if (!realRect) return
  console.log('发送给主进程 OCR:', realRect)
  window.api.screenshotAPI.ocr(realRect)
}
/** 点击取消 → 清空选区 */
const cancelSelection = (): void => {
  selection.value = null
  setTimeout(() => window.api.screenshotAPI.close(), 10)
}

/** 根据当前鼠标位置/最终选择，动态生成样式 */
const selectionStyle = computed(() => {
  const rect = selection.value || {
    x: Math.min(startX.value, currentX.value),
    y: Math.min(startY.value, currentY.value),
    width: Math.abs(startX.value - currentX.value),
    height: Math.abs(startY.value - currentY.value)
  }
  return {
    left: rect.x + 'px',
    top: rect.y + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px'
  }
})

/** 监听主进程发来的屏幕截图 */
onMounted(async () => {
  screenshot.value = await window.api.screenshotAPI.start()
  console.log(screenshot.value)
})
</script>

<style scoped>
/* 整个遮罩层 */
.snip-overlay {
  position: fixed;
  inset: 0;
  cursor: crosshair;
  z-index: 9999;
  overflow: hidden;
}

/* 背景截图 */
.screenshot {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}

/* 选区矩形 */
.selection-rect {
  position: absolute;
  border: 2px solid #3b82f6;
  background-color: rgba(59, 130, 246, 0.25);
  box-sizing: border-box;
}

/* 工具栏 */
.toolbar {
  position: absolute;
  top: -32px; /* 矩形上方 */
  right: 0;
  display: flex;
  gap: 6px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 6px;
  border-radius: 4px;
}

.btn {
  border: none;
  padding: 2px 6px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  background: transparent;
}

.btn.confirm:hover {
  color: #22c55e; /* 绿色 */
}

.btn.cancel:hover {
  color: #ef4444; /* 红色 */
}
.btn.ocr:hover {
  color: #12c1cd; /* 蓝色 */
}
</style>
