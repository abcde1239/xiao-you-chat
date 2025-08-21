<template>
  <div class="layout">
    <div :class="['left-menu', { collapsed }]">
      <!-- 折叠按钮 -->
      <n-button size="small" style="margin: 8px" circle @click="collapsed = !collapsed">
        {{ collapsed ? '▶' : '◀' }}
      </n-button>

      <!-- 菜单内容 -->
      <div v-if="collapsed" class="collapsed-menu"></div>

      <n-menu v-else :options="menuOptions" />
    </div>

    <!-- 右侧内容 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NMenu, NButton } from 'naive-ui'

const collapsed = ref(false)

const menuOptions = [
  { label: '首页', key: 'home' },
  { label: '关于', key: 'about' },
  { label: '设置', key: 'settings' }
]
</script>

<style scoped>
.layout {
  display: flex;
  width: 100%;
  height: 100vh;
}

.left-menu {
  flex-shrink: 0;
  width: 13rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  overflow: auto;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
}

.left-menu.collapsed {
  width: 3rem;
}

.left-menu .collapsed-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.main-content {
  flex: 1;
  overflow: auto;
  position: relative;
}
</style>
