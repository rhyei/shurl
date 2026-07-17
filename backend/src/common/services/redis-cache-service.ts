import type { Token } from '@enshou/core'
import type { RedisClient } from 'bun'

import { Inject } from '@enshou/core'

import type { CacheService } from '#/common/interfaces/cache-service'

import { REDIS } from '#/lib/redis'

export class RedisCacheService implements CacheService {
  @Inject(REDIS) redis!: RedisClient

  async get<Value>(key: string): Promise<Value | null> {
    try {
      let value = await this.redis.get(key)
      if (value === null) return null
      value = JSON.parse(value)
      return value as Value
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

  async rememberFor<Value>(
    key: string,
    ttl: number,
    callback: () => Promise<Value> | Value,
  ): Promise<Value> {
    let value = await this.get<Value>(key)
    if (value === null) {
      value = await callback()
      await this.set(key, JSON.stringify(value), ttl)
    }
    return value
  }

  async rememberAndProlong<Value>(
    key: string,
    ttl: number,
    callback: () => Promise<Value> | Value,
  ): Promise<Value> {
    let value = await this.get<Value>(key)
    if (value === null) {
      value = await callback()
      await this.set(key, JSON.stringify(value), ttl)
    } else await this.expire(key, ttl)

    return value
  }
}

export const CACHE_SERVICE = Symbol() as Token<CacheService>
