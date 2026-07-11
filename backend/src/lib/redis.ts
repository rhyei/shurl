import { token } from '@enshou/di'
import { RedisClient } from 'bun'

export const redis = new RedisClient()

export const REDIS = token(RedisClient)
