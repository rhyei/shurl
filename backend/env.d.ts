import type { LogLevel } from '@logtape/logtape'

declare module 'bun' {
  interface Env {
    PORT: string
    ORIGIN: string
    LOG_LEVEL: LogLevel

    REDIS_URL: string

    DATABASE_URL: string

    CLICKHOUSE_DB: string
    CLICKHOUSE_USER: string
    CLICKHOUSE_PASSWORD: string

    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_RECAPTCHA_SECRET: string
  }
}
