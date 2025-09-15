export type OK<T> = { ok: true; data: T }
export type Err = { ok: false; error: { code: string; message: string; cause?: unknown } }
export type Result<T> = OK<T> | Err
export interface Session {
  id: number
  title: string
  created_at: string
}
export interface Message {
  id: number
  session_id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
