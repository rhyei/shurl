import type { RedisClient } from 'bun'

import { createToken, Inject } from '@enshou/di'

import type { CacheService } from '#/common/interfaces/cache-service'

import { REDIS } from '#/lib/redis'

export const CACHE_SERVICE = createToken<RedisCacheService>('CacheService')

@Inject(REDIS)
export class RedisCacheService implements CacheService {
  constructor(private readonly redis: RedisClient) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      let value = await this.redis.get(key)
      if (value === null) return null
      value = JSON.parse(value)
      return value as T
    } catch {
      return null
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) await this.redis.setex(key, ttl, value)
    else await this.redis.set(key, value)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.redis.expire(key, ttl)
  }

  async remember<T>(key: string, ttl: number, callback: () => Promise<T> | T): Promise<T> {
    let value = await this.get<T>(key)
    if (value === null) {
      value = await callback()
      await this.set(key, JSON.stringify(value), ttl)
    }
    return value
  }
}
