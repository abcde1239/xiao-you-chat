import { Database } from 'better-sqlite3'
import type { Result, Session } from './types.js'

export const SessionTable = {
  name: 'sessions',
  sql: `CREATE TABLE IF NOT EXISTS sessions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
  createTable(db: Database) {
    db.prepare(this.sql).run()
  },
  create(db: Database, title: string): Result<number> {
    try {
      const stmt = db.prepare('INSERT INTO sessions (title) VALUES (?)')
      const result = db.transaction(() => stmt.run(title))()
      return { ok: true, data: result.lastInsertRowid as number }
    } catch (e) {
      return {
        ok: false,
        error: { code: 'DB_SESSION_CREATE', message: '创建会话失败', cause: e }
      }
    }
  },
  listAll(db: Database): Result<Session[]> {
    try {
      const stmt = db.prepare('SELECT * FROM sessions ORDER BY create_at DESC')
      return { ok: true, data: stmt.all() as Session[] }
    } catch (e) {
      console.log(e)
      return {
        ok: false,
        error: { code: 'DB_SESSION_LIST', message: '获取会话失败', cause: e }
      }
    }
  },
  update(db: Database, id: number, title: string): Result<null> {
    try {
      const stmt = db.prepare('UPDATE sessions SET title = ? WHERE id = ?')
      db.transaction(() => stmt.run(title, id))()
      return { ok: true, data: null }
    } catch (e) {
      return {
        ok: false,
        error: { code: 'DB_SESSION_UPDATE', message: '更新会话失败', cause: e }
      }
    }
  },
  delete(db: Database, id: number): Result<null> {
    try {
      const stmt = db.prepare('DELETE FROM sessions WHERE id = ?')
      db.transaction(() => stmt.run(id))()
      return { ok: true, data: null }
    } catch (e) {
      return {
        ok: false,
        error: { code: 'DB_SESSION_DELETE', message: '删除会话失败', cause: e }
      }
    }
  },
  getById(db: Database, id: number): Result<Session | null> {
    try {
      const stmt = db.prepare('SELECT * FROM sessions WHERE id = ?')
      const row = stmt.get(id) as Session | undefined
      return { ok: true, data: row ?? null }
    } catch (e) {
      return {
        ok: false,
        error: { code: 'DB_SESSION_GET', message: '获取会话失败', cause: e }
      }
    }
  }
}
