<template>
  <div class="app" :style="bg.bgStyle">
    <defaultLayout />
  </div>
</template>

<script setup lang="ts">
import { useBgStore } from './stores/bg'
import defaultLayout from './view/layout/defaultLayout.vue'
const bg = useBgStore()
</script>

<style scoped>
.app {
  position: relative;
  width: 100%;
  min-height: 100%;
}
</style>
