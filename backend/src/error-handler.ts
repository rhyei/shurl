import type { EnshouErrorHandler, HonoErrorHandler } from '@enshou/core'
import type { Logger } from '@logtape/logtape'

import { RestException } from '@enshou/core'
import { Inject } from '@enshou/di'

import { LOGGER } from '#/lib/logger'

@Inject(LOGGER)
export class ErrorHandler implements EnshouErrorHandler {
  constructor(private readonly logger: Logger) {}

  handle: HonoErrorHandler = (error) => {
    if (error instanceof RestException) return error.getResponse()
    this.logger.error('{requestId} {error}', { error })
    return new RestException(505).getResponse()
  }
}
