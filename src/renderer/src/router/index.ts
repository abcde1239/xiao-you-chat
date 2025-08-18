import { createRouter, createWebHistory } from 'vue-router'
import ChatWindow from '../view/ChatWindow.vue'
const routes = [{ path: '/', component: ChatWindow }]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
