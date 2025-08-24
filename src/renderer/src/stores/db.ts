import { defineStore } from 'pinia'
import { toRaw } from 'vue'

export const useDBStore = defineStore('db', {
  state: () => ({
    sessions: [] as { id: number; title: string; create_at: string }[]
  }),
  actions: {
    async initSessions() {
      this.sessions = await window.api.databaseAPI.Session.listAll()
      console.log(toRaw(this.sessions))
    },
    async addNewSession(title: string) {
      const now = new Date().toString()
      this.sessions.push({
        id: await window.api.databaseAPI.Session.create(title),
        title,
        create_at: now
      })
    }
  }
})
