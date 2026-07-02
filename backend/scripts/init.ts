import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'
import { migrate } from 'drizzle-orm/bun-sql/migrator'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

import { clickhouse } from '#/lib/clickhouse'
import { redis } from '#/lib/redis'
import { GUEST_URLS_FILTER_KEY, GUEST_URLS_FILTER_CAPACITY } from '#/modules/shortener/config'

async function initPostgres() {
  console.log('[Postgres] Starting migrations...')
  const client = new SQL({ url: Bun.env.DATABASE_URL, max: 1 })
  const db = drizzle(client)

  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('[Postgres] Migrations applied successfully')
}

async function initClickhouse() {
  console.log('[ClickHouse] Starting migrations...')

  await clickhouse.command({
    query: `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version UInt32,
        applied_at DateTime DEFAULT now()
      ) ENGINE = MergeTree()
      ORDER BY version;
    `,
  })

  const rs = await clickhouse.query({
    query: 'SELECT version FROM schema_migrations',
    format: 'JSONEachRow',
  })

  const appliedRows = await rs.json<{ version: number }>()
  const appliedVersions = new Set(appliedRows.map((r) => r.version))

  const migrationsDir = join(process.cwd(), 'clickhouse')
  const files = (await readdir(migrationsDir)).sort()

  for (const file of files) {
    const version = +file.split('_')[0]

    if (appliedVersions.has(version)) continue

    console.log(`[ClickHouse] Applying migration: ${file}`)
    const sql = await Bun.file(join(migrationsDir, file)).text()

    await clickhouse.command({ query: sql })

    await clickhouse.insert({
      table: 'schema_migrations',
      values: [{ version }],
      format: 'JSONEachRow',
    })
  }

  console.log('[ClickHouse] Migrations applied successfully')
}

async function initRedis() {
  console.log('[Redis] Initializing Bloom filter...')
  try {
    await redis.send('CF.RESERVE', [GUEST_URLS_FILTER_KEY, String(GUEST_URLS_FILTER_CAPACITY)])
    console.log('[Redis] Bloom filter reserved successfully')
  } catch (error) {
    if (error instanceof Error && !error.message.toLowerCase().includes('exists')) {
      throw error
    }
    console.log('[Redis] Bloom filter already exists')
  }
}

console.log('[Init] Bootstrapping infrastructure...')

try {
  await initPostgres()
  await initClickhouse()
  await initRedis()

  console.log('[Init] All services initialized successfully')
} catch (error) {
  console.error('[Init] Initialization failed:', error)
  process.exit(1)
}
