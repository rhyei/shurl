import type { EnshouMiddleware, Token } from '@enshou/core'
import type { Logger } from '@logtape/logtape'
import type { MiddlewareHandler } from 'hono'

import { Inject } from '@enshou/core'
import { withContext } from '@logtape/logtape'

import { LOGGER } from '#/lib/logger'

import { REQUEST_ID_HEADER } from './config'

export class LoggerMiddleware implements EnshouMiddleware {
  @Inject(LOGGER) logger!: Logger

  handle: MiddlewareHandler = async (c, next) => {
    const time = Date.now()

    const requestId = c.req.header(REQUEST_ID_HEADER) ?? crypto.randomUUID()
    c.set('requestId', requestId)
    c.header(REQUEST_ID_HEADER, requestId)

    await withContext({ requestId }, async () => {
      this.logger.info(`{requestId} ${c.req.method} ${c.req.url}`)
      await next()
      const seconds = (Date.now() - time) / 1000
      this.logger.info(`{requestId} ${c.req.method} ${c.req.url} ${c.res.status} ${seconds}s`)
    })
  }
}

export const LOGGER_MIDDLEWARE = Symbol() as Token<LoggerMiddleware>
