import type { JsonSchema } from '@enshou/openapi'

import { Application } from '@enshou/core'
import { OpenApiBuilder, scalarUi } from '@enshou/openapi'
import { toJsonSchema } from '@valibot/to-json-schema'
import { cors } from 'hono/cors'

import { db, DB } from '#/database'
import { ErrorHandler } from '#/error-handler'
import { LOGGER, loggerFactory } from '#/lib/logger'
import { redis, REDIS } from '#/lib/redis'
import { LOGGER_MIDDLEWARE, LoggerMiddleware } from '#/middleware/logger.middleware'
import { ShortenerController, ShortenerService, SHORTENER_SERVICE } from '#/modules/shortener'
import { GUEST_URLS_ID_SEQUENCE, GuestUrlsIdSequence } from '#/modules/shortener/services'

import { CACHE_SERVICE, RedisCacheService } from './common/services/redis-cache-service'
import {
  DYNAMIC_FILTER_SERVICE,
  RedisDynamicFilterService,
} from './common/services/redis-dynamic-filter-service'

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
    { provide: CACHE_SERVICE, useClass: RedisCacheService },
    { provide: DYNAMIC_FILTER_SERVICE, useClass: RedisDynamicFilterService },
    { provide: GUEST_URLS_ID_SEQUENCE, useClass: GuestUrlsIdSequence },
    { provide: LOGGER, useFactory: loggerFactory, scope: 'transient' },
    { provide: LOGGER_MIDDLEWARE, useClass: LoggerMiddleware },
    { provide: SHORTENER_SERVICE, useClass: ShortenerService },
  ],
  errorHandler: ErrorHandler,
  middlewares: [cors(), LOGGER_MIDDLEWARE],
})

const document = new OpenApiBuilder({
  info: { title: 'Shurl', version: '1.0.0' },
  controllers: app.controllers,
  schemaConverter: { toJsonSchema: (schema) => toJsonSchema(schema as any) as JsonSchema },
}).toDocument()

export default (await app.instantiate())
  .get('/api/openapi.json', (c) => c.json(document))
  .get('/api/docs', scalarUi({ specUrl: '/api/openapi.json', theme: 'alternate' }))
  .get('/api/health', (c) => c.text('ok'))
