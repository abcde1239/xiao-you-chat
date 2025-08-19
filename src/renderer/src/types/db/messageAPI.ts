import { Result, Message as DBMessage } from '../../../../main/db/types.js'

export interface Message {
  add: (sessionId: number, role: 'user' | 'assistant', content: string) => Result<number>
  delete: (id: number) => Result<null>
  listBySession: (sessionId: number) => Result<DBMessage>
}
