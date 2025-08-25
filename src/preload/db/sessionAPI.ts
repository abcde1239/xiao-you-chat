import { ipcRenderer } from 'electron'
export const Session = {
  create: async (title: string) => {
    const res = await ipcRenderer.invoke('db:createSession', title)
    if (res.ok) {
      return res.data
    } else {
      console.error(res.error.message, res.error.cause)
      return 0
    }
  },
  delete: (id: number) => {
    return ipcRenderer.invoke('db:deleteSession', id)
  },
  listAll: async () => {
    const res = await ipcRenderer.invoke('db:listSessions')

    if (res.ok) {
      return res.data
    } else {
      console.error(res.error.message, res.error.cause)
      return []
    }
  }
}
