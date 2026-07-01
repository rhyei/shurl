import { createToken } from '@enshou/di'
import { RedisClient } from 'bun'

export const REDIS = createToken<RedisClient>('Redis')

export const redis = new RedisClient()
