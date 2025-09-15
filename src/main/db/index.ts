/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* // main/db.ts
import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { SessionTable } from './sessions.js'
import { MessageTable } from './messages.js'

const dbPath = path.join(app.getPath('userData'), 'app.db')
const db = new Database(dbPath)

// 建表列表
const tables = [
  {
    name: 'sessions',
    sql: `CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      create_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  },
  {
    name: 'messages',
    sql: `CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES   sessions(id) ON DELETE CASCADE
    )`
  }
]
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
export const DB = {
  // 初始化所有表
  initTables(): void {
    tables.forEach((table) => {
      db.prepare(table.sql).run()
      console.log(`Table ${table.name} is ready.`)
    })
  }
}
export const Tables = {
  Session: SessionTable,
  Message: MessageTable
}
export default DB
 */
import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { SessionTable } from './sessions.js'
import { MessageTable } from './messages.js'
const dbPath = path.join(app.getPath('userData'), 'app.db')
const db = new Database(dbPath)
export class DBService {
  private db: Database

  constructor() {
    this.db = db
    this.initTables()
  }

  /** 初始化所有表 */
  private initTables(): void {
    const tables = [SessionTable, MessageTable]
    tables.forEach((table) => {
      this.db.prepare(table.sql).run()
      console.log(`Table ${table.name} is ready.`)
    })
  }

  /** ===== Session 操作 ===== */
  createSession(title: string) {
    return SessionTable.create(this.db, title)
  }

  listSessions() {
    return SessionTable.listAll(this.db)
  }

  deleteSession(id: number) {
    return SessionTable.delete(this.db, id)
  }

  /** ===== Message 操作 ===== */
  addMessage(sessionId: number, role: 'user' | 'assistant', content: string) {
    return MessageTable.add(this.db, sessionId, role, content)
  }

  listMessages(sessionId: number) {
    return MessageTable.listBySession(this.db, sessionId)
  }

  deleteMessage(id: number) {
    return MessageTable.delete(this.db, id)
  }
}
export const DB = new DBService()
