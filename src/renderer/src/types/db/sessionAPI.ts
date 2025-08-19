import { Result, Session as DBSession } from '../../../../main/db/types.js'

export interface Session {
  create: (title: string) => Result<number>
  delete: (id: number) => Result<null>
  listAll: () => Result<DBSession>
}
