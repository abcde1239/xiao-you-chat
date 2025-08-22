<template>
  <div class="layout">
    <div :class="['left-menu', { collapsed }]">
      <n-button class="toggle-btn" size="medium" circle @click="onToggle">
        <div v-if="collapsed">
          <n-icon size="22">
            <arrow-big-right />
          </n-icon>
        </div>
        <div v-else>
          <n-icon size="22">
            <arrow-big-left />
          </n-icon>
        </div>
      </n-button>

      <div class="inner-menu">
        <n-menu v-if="!collapsed" :options="menuOptions" />

        <div v-else class="collapsed-menu">
          <n-button
            v-for="item in menuOptions"
            :key="item.key"
            quaternary
            circle
            class="collapsed-btn"
            @click="onMenuClick(item.key)"
          >
            <n-icon size="22">
              <component :is="item.iconComp" />
            </n-icon>
          </n-button>
        </div>
      </div>
    </div>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { NMenu, NButton, NIcon } from 'naive-ui'
import ArrowBigRight from '@vicons/tabler/ArrowBigRight'
import ArrowBigLeft from '@vicons/tabler/ArrowBigLeft'

import { Home, InfoCircle, Settings } from '@vicons/tabler'

const collapsed = ref(false)

const renderIcon = (icon) => () => h(NIcon, null, { default: () => h(icon) })

const menuOptions = [
  { label: '首页', key: 'home', icon: renderIcon(Home), iconComp: Home },
  { label: '关于', key: 'about', icon: renderIcon(InfoCircle), iconComp: InfoCircle },
  { label: '设置', key: 'settings', icon: renderIcon(Settings), iconComp: Settings }
]

const onToggle = (e: MouseEvent): void => {
  collapsed.value = !collapsed.value
  ;(e.currentTarget as HTMLElement).blur()
}

const onMenuClick = (key: string): void => {
  console.log('点击菜单:', key)
}
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
  overflow-x: hidden;
  transition: width 0.3s;
  position: relative;
}

.inner-menu {
  margin-top: 4rem;
}

.left-menu.collapsed {
  width: 2.5rem;
}

.collapsed-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.collapsed-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.toggle-btn {
  position: absolute;
  top: 0.625rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  transition:
    transform 0.3s,
    left 0.3s;
}

.left-menu:not(.collapsed) .toggle-btn {
  left: auto;
  right: 0.3rem;
  transform: none;
}

.main-content {
  flex: 1;
  overflow: auto;
  position: relative;
}
</style>
