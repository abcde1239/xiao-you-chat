// main/db.ts
import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'

const dbPath = path.join(app.getPath('userData'), 'app.db')
const db = new Database(dbPath)

// 建表列表
const tables = [
  {
    name: 'users',
    sql: `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER
    )`
  }
]

// 初始化所有表
export function initTables(): void {
  tables.forEach((table) => {
    db.prepare(table.sql).run()
    console.log(`Table ${table.name} is ready.`)
  })
}
// CRUD 示例

export default db
