import type { UseFactory } from '@enshou/di'
import type { Logger } from '@logtape/logtape'

import { createToken } from '@enshou/di'
import { getFileSink } from '@logtape/file'
import { configure, getConsoleSink, getLogger, jsonLinesFormatter } from '@logtape/logtape'
import { prettyFormatter } from '@logtape/pretty'
import { AsyncLocalStorage } from 'node:async_hooks'

await configure({
  sinks: {
    console: getConsoleSink({ formatter: prettyFormatter }),
    file: getFileSink('shurl.log', {
      formatter: jsonLinesFormatter,
      lazy: true,
      bufferSize: 8192,
      flushInterval: 5000,
      nonBlocking: true,
    }),
  },
  loggers: [
    { category: ['logtape', 'meta'], lowestLevel: 'warning' },
    { category: [], lowestLevel: Bun.env.LOG_LEVEL, sinks: ['file', 'console'] },
  ],
  contextLocalStorage: new AsyncLocalStorage(),
})

export const LOGGER = createToken<Logger>('Logger')

export const loggerFactory: UseFactory<Logger> = (_container, context) => {
  const logger = getLogger(context.parent!.useClass!.name)
  return logger
}
