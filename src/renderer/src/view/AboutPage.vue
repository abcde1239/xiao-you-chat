<template>
  <div class="about-area"></div>
</template>

<script setup lang="ts"></script>

<style scoped>
.about-area {
  display: flex;
  flex-direction: column;
  width: 60%;
  position: absolute;
  left: 20%;
  justify-content: center;
  transition: height 0.3s ease;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  max-height: 65%;
}
</style>
