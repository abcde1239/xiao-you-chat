import { Result, Session as DBSession } from '../../../../main/db/types.ts'

export interface Session {
  create: (title: string) => Promise<number>
  delete: (id: number) => Result<null>
  listAll: () => Promise<DBSession[]>
}
