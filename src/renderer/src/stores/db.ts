import { defineStore } from 'pinia'

export const useDBStore = defineStore('db', {
  state: () => ({
    sessions: [] as { id: number; title: string; created_at: string }[]
  }),
  actions: {
    async initSessions() {
      this.sessions = await window.api.databaseAPI.Session.listAll()
    },
    async addNewSession(title: string) {
      const now = new Date().toString()
      const id = await window.api.databaseAPI.Session.create(title)
      this.sessions.push({
        id: id,
        title,
        created_at: now
      })
      return id
    }
  }
})
