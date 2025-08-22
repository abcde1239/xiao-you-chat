import { createRouter, createWebHashHistory } from 'vue-router'
import ChatPage from '../view/ChatPage.vue'
import AboutPage from '../view/AboutPage.vue'

const routes = [
  { path: '/', component: ChatPage },
  { path: '/about', component: AboutPage }
]

const router = createRouter({
  history: createWebHashHistory(), // 改成 Hash 模式
  routes
})

export default router
