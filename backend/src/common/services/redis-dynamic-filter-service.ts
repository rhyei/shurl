import type { Token } from '@enshou/core'
import type { RedisClient } from 'bun'

import { Inject } from '@enshou/core'

import type { DynamicFilterService } from '#/common/interfaces/dynamic-filter-service'

import { REDIS } from '#/lib/redis'

export class RedisDynamicFilterService implements DynamicFilterService {
  @Inject(REDIS) redis!: RedisClient

  async exists(filterKey: string, value: string): Promise<boolean> {
    const result = await this.redis.send('CF.EXISTS', [filterKey, value])
    return result === true
  }

  async insert(filterKey: string, value: string): Promise<void> {
    await this.redis.send('CF.ADD', [filterKey, value])
  }

  async delete(filterKey: string, value: string): Promise<void> {
    await this.redis.send('CF.DEL', [filterKey, value])
  }
}

export const DYNAMIC_FILTER_SERVICE = Symbol() as Token<DynamicFilterService>
