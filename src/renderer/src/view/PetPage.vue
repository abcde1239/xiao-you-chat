<template>
  <div
    ref="container"
    class="pet-container"
    @mousedown="startDrag"
    @click="handleClick"
    @contextmenu.prevent="showContextMenu"
  ></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import lottie, { AnimationItem } from 'lottie-web'
import animationData from '../assets/defaultPet.json'

const container = ref<HTMLDivElement | null>(null)
let animation: AnimationItem | null = null

// 拖动状态
let dragging = false
let lastX = 0
let lastY = 0

// 点击/双击状态
// eslint-disable-next-line no-undef
let clickTimeout: NodeJS.Timeout | null = null

onMounted(() => {
  if (container.value) {
    animation = lottie.loadAnimation({
      container: container.value,
      renderer: 'svg',
      loop: false, // 不自动循环
      autoplay: false, // 默认不播放
      animationData
    })
  }

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
})

onBeforeUnmount(() => {
  if (animation) animation.destroy()
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
})

const startDrag = (e: MouseEvent): void => {
  dragging = true
  lastX = e.screenX
  lastY = e.screenY
}

const onDrag = (e: MouseEvent): void => {
  if (!dragging) return
  const dx = e.screenX - lastX
  const dy = e.screenY - lastY
  lastX = e.screenX
  lastY = e.screenY
  window.api.petAPI.moveBy(dx, dy)
}

const stopDrag = (): void => {
  dragging = false
}

// 处理单击/双击
const handleClick = (): void => {
  if (clickTimeout) {
    // 第二次点击 → 认为是双击
    clearTimeout(clickTimeout)
    clickTimeout = null
    window.api.petAPI.showMain()
  } else {
    // 第一次点击 → 延时判断
    clickTimeout = setTimeout(() => {
      playAnimation()
      clickTimeout = null
    }, 250) // 250ms 内未第二次点击 → 单击
  }
}

// 播放一次动画
const playAnimation = (): void => {
  if (animation) {
    animation.stop()
    animation.play()
  }
}

const showContextMenu = (): void => {
  window.api.petAPI.showContextMenu()
}
</script>

<style scoped>
.pet-container {
  width: 150px;
  height: 150px;
  cursor: grab;
  background: transparent;
  overflow: hidden;
}
</style>
