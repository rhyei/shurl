import type { Logger } from '@logtape/logtape'

import { RestException } from '@enshou/core'
import { createToken, Inject } from '@enshou/di'
import { eq } from 'drizzle-orm'

import type { CacheService } from '#/common/interfaces/cache-service'
import type { DynamicFilterService } from '#/common/interfaces/dynamic-filter-service'
import type { Db } from '#/database'

import { CACHE_SERVICE } from '#/common/services/redis-cache-service'
import { DYNAMIC_FILTER_SERVICE } from '#/common/services/redis-dynamic-filter-service'
import { DB, guestUrls } from '#/database'
import { Sequence } from '#/database/utils'
import { LOGGER } from '#/lib/logger'
import { encodeBase62 } from '#/utils/encode-base62'

import { getShortUrlKey, SHORT_URL_TTL, GUEST_URLS_FILTER_KEY } from './config'
import { GUEST_URLS_ID_SEQUENCE } from './utils'

export const SHORTENER_SERVICE = createToken('ShortenerService')

@Inject(LOGGER, GUEST_URLS_ID_SEQUENCE, DB, CACHE_SERVICE, DYNAMIC_FILTER_SERVICE)
export class ShortenerService {
  constructor(
    private readonly logger: Logger,
    private readonly guestUrlIdSequence: Sequence,
    private readonly db: Db,
    private readonly cache: CacheService,
    private readonly dynamicFilter: DynamicFilterService,
  ) {}

  async shorten(originalUrl: string) {
    this.logger.debug(`{requestId} Shortening URL {originalUrl}`, { originalUrl })

    const nextValue = await this.guestUrlIdSequence.nextValue()

    const id = encodeBase62(nextValue)
    const shortUrl = `${Bun.env.ORIGIN}/g/${id}`

    await this.db.insert(guestUrls).values({ id, originalUrl })

    await Promise.allSettled([
      this.dynamicFilter.insert(GUEST_URLS_FILTER_KEY, id),
      this.cache.set(getShortUrlKey(id), originalUrl, SHORT_URL_TTL),
    ])

    this.logger.debug('{requestId} Shortened URL {id}', { id })

    return { id, originalUrl, shortUrl }
  }

  async resolve(id: string) {
    this.logger.debug(`{requestId} Resolving short URL {id}`, { id })

    const exists = await this.dynamicFilter.exists(GUEST_URLS_FILTER_KEY, id)
    if (!exists) {
      this.logger.debug(`{requestId} Id {id} rejected by bloom filter`, { id })
      throw RestException.NotFound()
    }

    const originalUrl = await this.cache.remember(getShortUrlKey(id), SHORT_URL_TTL, async () => {
      this.logger.debug(`{requestId} Cache miss for {id}, querying database`, { id })
      const url = await this.db.select().from(guestUrls).where(eq(guestUrls.id, id))
      return url[0]?.originalUrl
    })

    if (!originalUrl) throw RestException.NotFound()

    this.logger.debug('{requestId} Resolved URL {originalUrl}', { originalUrl })

    return originalUrl
  }
}
