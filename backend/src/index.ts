import { Application } from '@enshou/core'
import { OpenApiBuilder, scalarUi } from '@enshou/openapi'
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
import { ErrorHandler } from '#/error-handler'
import { clickhouse, CLICKHOUSE } from '#/lib/clickhouse'
import { LOGGER, loggerFactory } from '#/lib/logger'
import { redis, REDIS } from '#/lib/redis'
import { LOGGER_MIDDLEWARE, LoggerMiddleware } from '#/middleware/logger.middleware'
import { ShortenerController, ShortenerService, SHORTENER_SERVICE } from '#/modules/shortener'
import {
  GO_EVENT_TRACKER_MIDDLEWARE,
  GoEventTrackerMiddleware,
} from '#/modules/shortener/middleware/go-event-tracker.middleware'
import { GUEST_URLS_ID_SEQUENCE, GuestUrlsIdSequence } from '#/modules/shortener/utils'

declare module '@enshou/core' {
  interface GlobalEnv {
    Variables: {
      requestId: string
    }
  }
}

process.on('SIGINT', () => process.exit(0))

const app = new Application({
  controllers: [ShortenerController],
  providers: [
    { provide: DB, useValue: db },
    { provide: REDIS, useValue: redis },
    { provide: CLICKHOUSE, useValue: clickhouse },
    { provide: CACHE_SERVICE, useClass: RedisCacheService },
    { provide: DYNAMIC_FILTER_SERVICE, useClass: RedisDynamicFilterService },
    { provide: EVENT_TRACKER_SERVICE, useClass: ClickhouseEventTrackerService },
    { provide: GUEST_URLS_ID_SEQUENCE, useClass: GuestUrlsIdSequence },
    { provide: LOGGER, useFactory: loggerFactory, scope: 'transient' },
    { provide: GO_EVENT_TRACKER_MIDDLEWARE, useClass: GoEventTrackerMiddleware },
    { provide: LOGGER_MIDDLEWARE, useClass: LoggerMiddleware },
    { provide: SHORTENER_SERVICE, useClass: ShortenerService },
  ],
  errorHandler: ErrorHandler,
  middlewares: [cors(), LOGGER_MIDDLEWARE],
})

const openapi = new OpenApiBuilder({
  info: { title: 'Shurl', version: '1.0.0' },
  controllers: app.controllers,
  schemaConverter: { toJsonSchema },
}).toDocument()

export default (await app.instantiate())
  .get('/api/openapi.json', (c) => c.json(openapi))
  .get('/api/docs', scalarUi({ specUrl: '/api/openapi.json' }))
  .get('/api/health', (c) => c.text('ok'))
