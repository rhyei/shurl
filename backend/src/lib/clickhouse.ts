import { createClient } from '@clickhouse/client'
import { token } from '@enshou/di'

export const clickhouse = createClient({
  url: Bun.env.CLICKHOUSE_URL,
  username: Bun.env.CLICKHOUSE_USER,
  password: Bun.env.CLICKHOUSE_PASSWORD,
  database: Bun.env.CLICKHOUSE_DB,
  clickhouse_settings: { async_insert: 1, wait_for_async_insert: 1 },
})

export const CLICKHOUSE = token<ReturnType<typeof createClient>>('Clickhouse')
