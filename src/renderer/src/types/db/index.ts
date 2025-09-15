import { Message } from './messageAPI.js'
import { Session } from './sessionAPI.js'
export interface IDatabaseAPI {
  Session: Session
  Message: Message
}
