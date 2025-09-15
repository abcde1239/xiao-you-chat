<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="about-area">
    <div class="title">
      <n-gradient-text
        :size="24"
        :gradient="{
          from: '#000000',
          to: '#999999'
        }"
      >
        About me
      </n-gradient-text>
    </div>
    <div class="content">
      <p>.......</p>
      <p>没什么可说的,有的时候这就是生活</p>
      <p>文字提取的准确度跟清晰度有关</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NGradientText } from 'naive-ui'
</script>

<style scoped>
.about-area {
  display: flex;
  flex-direction: column;
  width: 54%;
  position: absolute;
  padding: 0.5rem;
  top: 2%;
  left: 23%;
  transition: height 0.3s ease;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  backdrop-filter: blur(4px);
  height: 96%;
  overflow-y: auto;
  box-sizing: border-box;
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
