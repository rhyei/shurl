import type { NodeClickHouseClient } from '@clickhouse/client/dist/client'
import type { Token } from '@enshou/core'

import { createClient } from '@clickhouse/client'

export const clickhouse = createClient({
  url: Bun.env.CLICKHOUSE_URL,
  username: Bun.env.CLICKHOUSE_USER,
  password: Bun.env.CLICKHOUSE_PASSWORD,
  database: Bun.env.CLICKHOUSE_DB,
  clickhouse_settings: { async_insert: 1, wait_for_async_insert: 1 },
})

export const CLICKHOUSE = Symbol() as Token<NodeClickHouseClient>
