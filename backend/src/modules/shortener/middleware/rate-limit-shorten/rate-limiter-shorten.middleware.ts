import type { EnshouMiddleware, Token } from '@enshou/core'
import type { RedisClient } from 'bun'
import type { MiddlewareHandler } from 'hono'

import { HttpException, Inject } from '@enshou/core'
import { getConnInfo } from 'hono/bun'

import { REDIS } from '#/lib/redis'
import { extractIpFromHeader } from '#/utils/extract-ip-from-header'

import {
  RATE_LIMIT_ANON_SHORTEN_TTL,
  VERIFY_GOOGLE_RECAPTCHA_URL,
  getRateLimitAnonShortenKey,
} from './config'

export class RateLimitShortenMiddleware implements EnshouMiddleware {
  @Inject(REDIS) redis!: RedisClient

  handle: MiddlewareHandler = async (c, next) => {
    const connectionAddress = getConnInfo(c).remote.address!
    const userIp = extractIpFromHeader(c.req.header('x-forwarded-for')) ?? connectionAddress

    const redisKey = getRateLimitAnonShortenKey(userIp)
    const requestsCount = await this.redis.incr(redisKey)
    if (requestsCount === 1) await this.redis.expire(redisKey, RATE_LIMIT_ANON_SHORTEN_TTL)

    const requestBody = await c.req.json()
    const retryAfter = await this.redis.ttl(redisKey)
    if (requestsCount > 5 && !requestBody.googleReCaptcha) {
      throw new HttpException(429, { headers: { 'Retry-After': retryAfter } })
    }

    const verifyData = new URLSearchParams()
    verifyData.append('secret', Bun.env.GOOGLE_RECAPTCHA_SECRET)
    verifyData.append('response', requestBody.googleReCaptcha)
    if (userIp && userIp !== connectionAddress) verifyData.append('remoteip', userIp)

    const scoreResponse = await fetch(VERIFY_GOOGLE_RECAPTCHA_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: verifyData,
    })

    const { success, score } = (await scoreResponse.json()) as { success: boolean; score?: number }

    if (success && score! > 0.5) return next()

    throw new HttpException(429, { headers: { 'Retry-After': retryAfter } })
  }
}

export const RATE_LIMIT_SHORTEN_MIDDLEWARE = Symbol() as Token<RateLimitShortenMiddleware>
