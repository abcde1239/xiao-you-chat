import { Result } from '../../../../main/db/types.ts'

export interface Message {
  add: (sessionId: number, role: 'user' | 'assistant', content: string) => Promise<number>
  delete: (id: number) => Result<null>
  listBySession: (sessionId: number) => Promise<{ role: 'user' | 'assistant'; content: string }[]>
}
