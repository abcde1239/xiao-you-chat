import { createRouter, createWebHashHistory } from 'vue-router'
import ChatWindow from '../view/ChatWindow.vue'

const routes = [{ path: '/', component: ChatWindow }]

const router = createRouter({
  history: createWebHashHistory(), // 改成 Hash 模式
  routes
})

export default router
