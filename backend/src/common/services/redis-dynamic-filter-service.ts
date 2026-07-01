import type { RedisClient } from 'bun'

import { createToken, Inject } from '@enshou/di'

import type { DynamicFilterService } from '#/common/interfaces/dynamic-filter-service'

import { REDIS } from '#/lib/redis'

export const DYNAMIC_FILTER_SERVICE = createToken<DynamicFilterService>('DynamicFilterService')

@Inject(REDIS)
export class RedisDynamicFilterService implements DynamicFilterService {
  constructor(private readonly redis: RedisClient) {}

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
