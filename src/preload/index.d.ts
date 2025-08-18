import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      openFileDialog(): () => void
      onSetBackground: (callback: (bg: string) => void) => void
      updateBackground: (bg: string) => void
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      askDeepSeek: (prompt: string) => Promise<any>
      updateApiKey: (key: string) => void
      onSetApiKey: (callback: (key?: string) => void) => void
    }
  }
}
