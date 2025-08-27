import { createRouter, createWebHashHistory } from 'vue-router'
import ChatPage from '../view/ChatPage.vue'
import AboutPage from '../view/AboutPage.vue'
import PetPage from '../view/PetPage.vue'
const routes = [
  { path: '/', component: ChatPage },
  { path: '/about', component: AboutPage },
  { path: '/pet', component: PetPage }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
