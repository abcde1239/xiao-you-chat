<template>
  <div class="app" :style="bg.bgStyle">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useBgStore } from './stores/bg'

const bg = useBgStore()
</script>

<style scoped>
.app {
  position: relative;
  width: 100%;
  min-height: 100%;
  padding-left: 2%;
}
</style>
