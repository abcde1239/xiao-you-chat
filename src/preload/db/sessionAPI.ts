import { ipcRenderer } from 'electron'
export const Session = {
  create: (title: string) => {
    return ipcRenderer.invoke('db:createSession', title)
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
