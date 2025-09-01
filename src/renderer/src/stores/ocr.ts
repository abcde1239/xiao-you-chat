// stores/ocr.ts
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useOcrStore = defineStore('ocr', {
  state: () => ({
    img: '' as string,
    route: '' as string
  }),
  actions: {
    listenOcr() {
      const router = useRouter()

      window.api.screenshotAPI.getOcr((data) => {
        console.log('📩 收到 OCR 数据:', data)

        // 保存数据
        this.img = data.img
        this.route = data.route

        // 第一步：跳转路由
        if (router.currentRoute.value.path !== data.route) {
          router.push(data.route)
        }
      })
    }
  }
})
