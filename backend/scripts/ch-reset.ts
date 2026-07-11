import { createClient } from '@clickhouse/client'

export const clickhouse = createClient({
  url: Bun.env.CLICKHOUSE_URL,
  username: Bun.env.CLICKHOUSE_USER,
  password: Bun.env.CLICKHOUSE_PASSWORD,
})

try {
  await clickhouse.command({
    query: `DROP DATABASE IF EXISTS ${Bun.env.CLICKHOUSE_DB} SYNC`,
  })
  await clickhouse.command({ query: `CREATE DATABASE ${Bun.env.CLICKHOUSE_DB}` })

  console.log('[CH Reset] Database reset successfully')
} catch (error) {
  console.error('[CH Reset] Failed:', error)
  process.exit(1)
} finally {
  await clickhouse.close()
}
