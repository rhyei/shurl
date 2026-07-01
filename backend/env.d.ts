import type { LogLevel } from '@logtape/logtape'

declare module 'bun' {
  interface Env {
    PORT: string
    DATABASE_URL: string
    REDIS_URL: string
    LOG_LEVEL: LogLevel
    ORIGIN: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
  }
}
