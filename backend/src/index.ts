import { Application } from '@enshou/core'
import { CronPlugin } from '@enshou/cron'
import { OpenApiPlugin } from '@enshou/openapi'
import { toJsonSchema } from '@valibot/to-json-schema'
import { cors } from 'hono/cors'

import {
  ClickhouseEventTrackerService,
  EVENT_TRACKER_SERVICE,
} from '#/common/services/clickhouse-event-tracker-service'
import { CACHE_SERVICE, RedisCacheService } from '#/common/services/redis-cache-service'
import {
  DYNAMIC_FILTER_SERVICE,
  RedisDynamicFilterService,
} from '#/common/services/redis-dynamic-filter-service'
import { db, DB } from '#/database'
import { SEQUENCE_SERVICE, SequenceService } from '#/database/utils'
import { ErrorHandler } from '#/error-handler'
import { clickhouse, CLICKHOUSE } from '#/lib/clickhouse'
import { LOGGER, loggerFactory } from '#/lib/logger'
import { redis, REDIS } from '#/lib/redis'
import { LOGGER_MIDDLEWARE, LoggerMiddleware } from '#/middleware/logger'
import { ShortenerController, ShortenerService, SHORTENER_SERVICE } from '#/modules/shortener'
import {
  GO_EVENT_TRACKER_MIDDLEWARE,
  GoEventTrackerMiddleware,
  RATE_LIMIT_SHORTEN_MIDDLEWARE,
  RateLimitShortenMiddleware,
} from '#/modules/shortener/middleware'

declare module '@enshou/core' {
  interface GlobalEnv {
    Variables: {
      requestId: string
    }
  }
}

process.on('SIGINT', () => process.exit(0))

const application = new Application({
  controllers: [ShortenerController],
  providers: [
    { provide: DB, useValue: db },
    { provide: REDIS, useValue: redis },
    { provide: CLICKHOUSE, useValue: clickhouse },
    { provide: CACHE_SERVICE, useClass: RedisCacheService },
    { provide: DYNAMIC_FILTER_SERVICE, useClass: RedisDynamicFilterService },
    { provide: EVENT_TRACKER_SERVICE, useClass: ClickhouseEventTrackerService },
    { provide: SEQUENCE_SERVICE, useClass: SequenceService },
    { provide: LOGGER, useFactory: loggerFactory, scope: 'transient' },
    { provide: GO_EVENT_TRACKER_MIDDLEWARE, useClass: GoEventTrackerMiddleware },
    { provide: LOGGER_MIDDLEWARE, useClass: LoggerMiddleware },
    { provide: RATE_LIMIT_SHORTEN_MIDDLEWARE, useClass: RateLimitShortenMiddleware },
    { provide: SHORTENER_SERVICE, useClass: ShortenerService },
  ],
  errorHandler: ErrorHandler,
  middlewares: [cors(), LOGGER_MIDDLEWARE],
  plugins: [
    CronPlugin({ jobs: [] }),
    OpenApiPlugin({
      openapi: {
        path: '/api/openapi.json',
        info: { title: 'Shurl', version: '1.0.0' },
        resolver: { toJsonSchema },
        servers: [{ url: 'http://localhost:3113' }],
      },
      scalar: { path: '/docs' },
    }),
  ],
})

const hono = await application.instantiate()

hono.get('/api/health', (c) => c.text('ok'))

export default hono
