import type { ErrorHandler as EnshouErrorHandler } from '@enshou/core'
import type { Logger } from '@logtape/logtape'
import type { ErrorHandler as HonoErrorHandler } from 'hono/types'

import { RestException } from '@enshou/core'
import { Inject } from '@enshou/di'

import { LOGGER } from '#/lib/logger'

@Inject(LOGGER)
export class ErrorHandler implements EnshouErrorHandler {
  constructor(private readonly logger: Logger) {}

  handle: HonoErrorHandler = (error, c) => {
    if (error instanceof RestException) return c.json({ error }, error.status)
    this.logger.error('{requestId}', error)
    return RestException.InternalServerError().toHTTP().getResponse()
  }
}
