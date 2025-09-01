<template>
  <div class="app" :style="bg.bgStyle">
    <router-view v-if="isPetRoute || isScreenshotRoute" />
    <defaultLayout v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import defaultLayout from './view/layout/defaultLayout.vue'
import { useBgStore } from './stores/bg'
import { useOcrStore } from './stores/ocr'
const bg = useBgStore()
const route = useRoute()

// 判断当前路由是否为桌宠页面
const isPetRoute = computed(() => route.path === '/pet')
const isScreenshotRoute = computed(() => route.path === '/screenshot')
onMounted(() => {
  const ocrStore = useOcrStore()
  ocrStore.listenOcr()
})
</script>
<style scoped>
.app {
  position: relative;
  width: 100%;
  min-height: 100%;
}
</style>
