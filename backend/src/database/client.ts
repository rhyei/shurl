import { createToken } from '@enshou/di'
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'

export const DB = createToken<Db>('Db')

const client = new SQL({ max: 20, url: Bun.env.DATABASE_URL })
export const db = drizzle(client)
export type Db = typeof db
