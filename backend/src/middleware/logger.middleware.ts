import type { Middleware } from '@enshou/core'
import type { Logger } from '@logtape/logtape'
import type { Context, Next } from 'hono'

import { Inject, token } from '@enshou/di'
import { withContext } from '@logtape/logtape'

import { LOGGER } from '#/lib/logger'

export const REQUEST_ID_HEADER = 'x-request-id'

@Inject(LOGGER)
export class LoggerMiddleware implements Middleware {
  constructor(private logger: Logger) {}

  async handle(c: Context, next: Next) {
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

export const LOGGER_MIDDLEWARE = token(LoggerMiddleware)
