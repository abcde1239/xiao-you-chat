import { Database } from 'better-sqlite3'
import { Result, Message } from './types.js'
export const MessageTable = {
  name: 'messages',
  sql: `CREATE TABLE IF NOT EXISTS messages(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE)`,
  add(
    db: Database,
    sessionId: number,
    role: 'user' | 'assistant',
    content: string
  ): Result<number> {
    try {
      const stmt = db.prepare('INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)')
      const result = db.transaction(() => stmt.run(sessionId, role, content))()
      return { ok: true, data: result.lastInsertRowid as number }
    } catch (e) {
      return { ok: false, error: { code: 'DB_MESSAGE_ADD', message: '插入消息失败', cause: e } }
    }
  },
  listBySession(db: Database, sessionId: number): Result<Message[]> {
    try {
      const stmt = db.prepare('SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC')
      const result = db.transaction(() => stmt.all(sessionId))()
      return { ok: true, data: result as Message[] }
    } catch (e) {
      return { ok: false, error: { code: 'DB_MESSAGE_LIST', message: '获取消息失败', cause: e } }
    }
  },
  updateContent(db: Database, id: number, content: string): Result<null> {
    try {
      const stmt = db.prepare('UPDATE messages SET content = ? WHERE id = ?')
      db.transaction(() => stmt.run(content, id))()
      return { ok: true, data: null }
    } catch (e) {
      return {
        ok: false,
        error: {
          code: 'DB_MESSAGE_UPDATE',
          message: '更新消息失败',
          cause: e
        }
      }
    }
  },
  delete(db: Database, id: number): Result<null> {
    try {
      const stmt = db.prepare('DELETE FROM messages WHERE id = ?')
      db.transaction(() => stmt.run(id))()
      return { ok: true, data: null }
    } catch (e) {
      return { ok: false, error: { code: 'DB_MESSAGE_DELETE', message: '删除消息失败', cause: e } }
    }
  },
  deleteBySession(db: Database, sessionId: number): Result<null> {
    try {
      const stmt = db.prepare('DELETE FROM messages WHERE session_id = ?')
      db.transaction(() => stmt.run(sessionId))()
      return { ok: true, data: null }
    } catch (e) {
      return {
        ok: false,
        error: {
          code: 'DB_MESSAGE_DELETE_SESSION',
          message: '删除会话消息',
          cause: e
        }
      }
    }
  }
}
