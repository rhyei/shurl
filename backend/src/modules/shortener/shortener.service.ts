import type { Token } from '@enshou/core'
import type { Logger } from '@logtape/logtape'

import { HttpException, Inject } from '@enshou/core'
import { eq } from 'drizzle-orm'

import type { CacheService } from '#/common/interfaces/cache-service'
import type { DynamicFilterService } from '#/common/interfaces/dynamic-filter-service'
import type { Db } from '#/database'

import { CACHE_SERVICE } from '#/common/services/redis-cache-service'
import { DYNAMIC_FILTER_SERVICE } from '#/common/services/redis-dynamic-filter-service'
import { DB, guestUrls, guestUrlsIdSeq } from '#/database'
import { SEQUENCE_SERVICE, SequenceService } from '#/database/utils'
import { LOGGER } from '#/lib/logger'
import { encodeBase62 } from '#/utils/encode-base62'

import { getShortUrlKey, SHORT_URL_TTL, GUEST_URLS_FILTER_KEY } from './config'

export class ShortenerService {
  @Inject(LOGGER) logger!: Logger
  @Inject(DB) db!: Db
  @Inject(SEQUENCE_SERVICE) sequence!: SequenceService
  @Inject(CACHE_SERVICE) cache!: CacheService
  @Inject(DYNAMIC_FILTER_SERVICE) dynamicFilter!: DynamicFilterService

  async shorten(originalUrl: string) {
    this.logger.debug(`{requestId} Shortening URL {originalUrl}`, { originalUrl })

    const nextValue = await this.sequence.nextValue(guestUrlsIdSeq)

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

    const urlExists = await this.dynamicFilter.exists(GUEST_URLS_FILTER_KEY, id)
    if (!urlExists) {
      this.logger.debug(`{requestId} Id {id} rejected by bloom filter`, { id })
      throw new HttpException(404)
    }

    const originalUrl = await this.cache.rememberAndProlong(
      getShortUrlKey(id),
      SHORT_URL_TTL,
      async () => {
        this.logger.debug(`{requestId} Cache miss for {id}, querying database`, { id })
        const url = await this.db.select().from(guestUrls).where(eq(guestUrls.id, id))
        return url[0]?.originalUrl
      },
    )

    if (!originalUrl) throw new HttpException(404)

    this.logger.debug('{requestId} Resolved URL {originalUrl}', { originalUrl })

    return originalUrl
  }
}

export const SHORTENER_SERVICE = Symbol() as Token<ShortenerService>
