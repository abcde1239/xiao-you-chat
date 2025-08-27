import { createRouter, createWebHashHistory } from 'vue-router'
import ChatPage from '../view/ChatPage.vue'
import AboutPage from '../view/AboutPage.vue'
import PetPage from '../view/PetPage.vue'
const routes = [
  { path: '/', redirect: '/chat' },
  { path: '/about', component: AboutPage },
  { path: '/pet', component: PetPage },
  { path: '/chat', component: ChatPage }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
