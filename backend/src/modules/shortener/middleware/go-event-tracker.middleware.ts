import type { Middleware } from '@enshou/core'
import type { Context, Next } from 'hono'

import { createToken, Inject } from '@enshou/di'
import { lookup } from 'ip-location-api'
import { isbot } from 'isbot'

import type { EventTrackerService } from '#/common/interfaces/event-tracker-service'

import { EVENT_TRACKER_SERVICE } from '#/common/services/clickhouse-event-tracker-service'

export const GO_EVENT_TRACKER_MIDDLEWARE = createToken<GoEventTrackerMiddleware>(
  'GoEventTrackerMiddleware',
)

@Inject(EVENT_TRACKER_SERVICE)
export class GoEventTrackerMiddleware implements Middleware {
  constructor(private readonly eventTracker: EventTrackerService) {}

  async handle(c: Context, next: Next) {
    const userAgent = c.req.header('user-agent')
    const userIp = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()

    void this.eventTracker.trackGo({
      short_id: c.req.param('id')!,
      user_agent: userAgent ?? 'Unknown',
      referer: c.req.header('referer') ?? 'Direct',
      user_ip: userIp || '::',
      country: (userIp && (await lookup(userIp))?.country) ?? '',
      is_bot: !userAgent || isbot(userAgent),
    })

    await next()
  }
}
