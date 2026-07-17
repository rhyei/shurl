import type { Token } from '@enshou/core'

import { RedisClient } from 'bun'

export const redis = new RedisClient()

export const REDIS = Symbol() as Token<RedisClient>
