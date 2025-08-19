import { ipcRenderer } from 'electron'
export const Session = {
  create: (title: string) => {
    return ipcRenderer.invoke('db:createSession', title)
  },
  delete: (id: number) => {
    return ipcRenderer.invoke('db:deleteSession', id)
  },
  listAll: () => {
    return ipcRenderer.invoke('db:listSessions')
  }
}
