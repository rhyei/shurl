import type { ClickHouseClient } from '@clickhouse/client'
import type { Token } from '@enshou/core'
import type { Logger } from '@logtape/logtape'

import { Inject } from '@enshou/core'

import type { EventTrackerService, GoEvent } from '#/common/interfaces/event-tracker-service'

import { CLICKHOUSE } from '#/lib/clickhouse'
import { LOGGER } from '#/lib/logger'

export class ClickhouseEventTrackerService implements EventTrackerService {
  @Inject(LOGGER) logger!: Logger
  @Inject(CLICKHOUSE) clickhouse!: ClickHouseClient

  trackGo(event: GoEvent) {
    void this.clickhouse
      .insert({ table: 'go_events', values: [event], format: 'JSONEachRow' })
      .catch((error) => {
        return this.logger.error('{requestId} {error}', { error })
      })
  }
}

export const EVENT_TRACKER_SERVICE = Symbol() as Token<EventTrackerService>
