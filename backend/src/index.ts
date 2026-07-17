import { Application } from '@enshou/core'
import { CronPlugin } from '@enshou/cron'
import { OpenApiPlugin, valibotAdapter } from '@enshou/openapi'
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
import { ShortenModule } from '#/modules/shortener/shortener.module'

declare module '@enshou/core' {
  interface GlobalEnv {
    Variables: {
      requestId: string
    }
  }
}

const application = new Application({
  modules: [ShortenModule],
  providers: [
    { provide: DB, useValue: db },
    { provide: REDIS, useValue: redis },
    { provide: CLICKHOUSE, useValue: clickhouse },
    { provide: CACHE_SERVICE, useClass: RedisCacheService },
    { provide: DYNAMIC_FILTER_SERVICE, useClass: RedisDynamicFilterService },
    { provide: EVENT_TRACKER_SERVICE, useClass: ClickhouseEventTrackerService },
    { provide: SEQUENCE_SERVICE, useClass: SequenceService },
    { provide: LOGGER, useFactory: loggerFactory, scope: 'transient' },
    { provide: LOGGER_MIDDLEWARE, useClass: LoggerMiddleware },
  ],
  errorHandler: ErrorHandler,
  middlewares: [cors(), LOGGER_MIDDLEWARE],
  plugins: [
    CronPlugin({ jobs: [] }),
    OpenApiPlugin({
      adapter: valibotAdapter,
      openapi: {
        path: '/api/openapi.json',
        info: { title: 'Shurl', version: '1.0.0' },
      },
      scalar: { path: '/docs' },
    }),
  ],
})

const hono = await application.instantiate()

hono.get('/api/health', (c) => {
  return c.text('ok')
})

export default hono
