import type { EnshouErrorHandler } from '@enshou/core'
import type { Logger } from '@logtape/logtape'

import { HttpException, Inject } from '@enshou/core'

import { LOGGER } from '#/lib/logger'

export class ErrorHandler implements EnshouErrorHandler {
  @Inject(LOGGER) logger!: Logger

  handle = (error: Error) => {
    if (error instanceof HttpException) return error.getResponse()
    this.logger.error('{requestId} {error}', { error })
    return new HttpException(505).getResponse()
  }
}
