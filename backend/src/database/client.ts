import type { Token } from '@enshou/core'

import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'

const client = new SQL({ max: 20, url: Bun.env.DATABASE_URL })
export const db = drizzle(client)
export type Db = typeof db

export const DB = Symbol() as Token<Db>
