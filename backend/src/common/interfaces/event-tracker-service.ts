export interface GoEvent {
  short_id: string
  user_agent: string
  referer: string
  user_ip: string
  country: string
  is_bot: boolean
}

export interface EventTrackerService {
  trackGo: (event: GoEvent) => Promise<void> | void
}
