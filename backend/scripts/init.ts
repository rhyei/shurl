import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'
import { migrate } from 'drizzle-orm/bun-sql/migrator'

import { redis } from '#/lib/redis'
import { GUEST_URLS_FILTER_KEY, GUEST_URLS_FILTER_CAPACITY } from '#/modules/shortener/config'

const client = new SQL({ url: Bun.env.DATABASE_URL, max: 1 })
const db = drizzle(client)

console.log('Starting migrations...')
try {
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('DB migrations applied successfully!')

  try {
    await redis.send('CF.RESERVE', [GUEST_URLS_FILTER_KEY, String(GUEST_URLS_FILTER_CAPACITY)])
    console.log('Redis Bloom filter reserved successfully!')
  } catch (error) {
    if (error instanceof Error && !error.message.toLowerCase().includes('exists')) throw error
    console.log('Redis Bloom filter already exists.')
  }

  process.exit(0)
} catch (error) {
  console.error('Migration failed:', error)
  process.exit(1)
}
