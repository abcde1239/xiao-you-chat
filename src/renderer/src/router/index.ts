import { createRouter, createWebHashHistory } from 'vue-router'
import ChatPage from '../view/ChatPage.vue'
import AboutPage from '../view/AboutPage.vue'
import PetPage from '../view/PetPage.vue'
import ScanPage from '../view/ScanPage.vue'
import ScreenshotPage from '../view/ScreenshotPage.vue'
const routes = [
  { path: '/', redirect: '/chat' },
  { path: '/about', component: AboutPage },
  { path: '/pet', component: PetPage },
  { path: '/chat', component: ChatPage },
  { path: '/scan', component: ScanPage },
  { path: '/screenshot', component: ScreenshotPage }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
