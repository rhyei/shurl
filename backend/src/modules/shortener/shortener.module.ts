import type { Module } from '@enshou/core'

import {
  GO_EVENT_TRACKER_MIDDLEWARE,
  GoEventTrackerMiddleware,
  RATE_LIMIT_SHORTEN_MIDDLEWARE,
  RateLimitShortenMiddleware,
} from './middleware'
import { ShortenController } from './shortener.controller'
import { SHORTENER_SERVICE, ShortenerService } from './shortener.service'

export const ShortenModule: Module = {
  name: 'ShortenModule',
  controllers: [ShortenController],
  providers: [
    { provide: SHORTENER_SERVICE, useClass: ShortenerService },
    { provide: GO_EVENT_TRACKER_MIDDLEWARE, useClass: GoEventTrackerMiddleware },
    { provide: RATE_LIMIT_SHORTEN_MIDDLEWARE, useClass: RateLimitShortenMiddleware },
  ],
} as const
