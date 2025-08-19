import { Message } from './messageAPI.js'
import { Session } from './sessionAPI.js'
export interface DatabaseAPI {
  Session: Session
  Message: Message
}
