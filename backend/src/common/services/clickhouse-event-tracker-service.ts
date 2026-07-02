import type { ClickHouseClient } from '@clickhouse/client'
import type { Logger } from '@logtape/logtape'

import { createToken, Inject } from '@enshou/di'

import type { EventTrackerService, GoEvent } from '#/common/interfaces/event-tracker-service'

import { CLICKHOUSE } from '#/lib/clickhouse'
import { LOGGER } from '#/lib/logger'

export const EVENT_TRACKER_SERVICE = createToken<EventTrackerService>('EventTrackerService')

@Inject(LOGGER, CLICKHOUSE)
export class ClickhouseEventTrackerService implements EventTrackerService {
  constructor(
    private readonly logger: Logger,
    private readonly clickhouse: ClickHouseClient,
  ) {}

  trackGo(event: GoEvent) {
    void this.clickhouse
      .insert({
        table: 'go_events',
        values: [event],
        format: 'JSONEachRow',
      })
      .catch((error) => this.logger.error('{requestId} {error}', { error }))
  }
}
