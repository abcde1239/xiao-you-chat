<template>
  <div class="app" :style="bg.bgStyle">
    <!-- 只有路由不是 /pet 才显示 DefaultLayout -->
    <defaultLayout v-if="!isPetRoute" />

    <!-- 路由内容 -->
    <router-view v-if="isPetRoute" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import defaultLayout from './view/layout/defaultLayout.vue'
import { useBgStore } from './stores/bg'
const bg = useBgStore()
const route = useRoute()

// 判断当前路由是否为桌宠页面
const isPetRoute = computed(() => route.path === '/pet')
</script>
<style scoped>
.app {
  position: relative;
  width: 100%;
  min-height: 100%;
}
</style>
