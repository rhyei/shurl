export const RATE_LIMIT_ANON_SHORTEN_TTL = 60 * 60
export function getRateLimitAnonShortenKey(ip: string) {
  return `ratelimit:anon:shorten:${ip}`
}

export const VERIFY_GOOGLE_RECAPTCHA_URL = 'https://www.google.com/recaptcha/api/siteverify'
