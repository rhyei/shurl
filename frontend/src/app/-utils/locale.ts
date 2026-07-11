import type { Locale } from '@kanjou/react'

import { createIsomorphicFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

const COOKIE_TTL = 60 * 60 * 24 * 365 * 1000 // 1 year in ms
const COOKIE_NAME = 'locale'

export const getLocale = createIsomorphicFn()
  .client(async () => {
    const cookie = await cookieStore.get(COOKIE_NAME)
    return (cookie?.value ?? 'en') as Locale
  })
  .server(() => (getCookie(COOKIE_NAME) ?? 'en') as Locale)

export function setLocale(value: Locale) {
  void cookieStore.set({
    name: COOKIE_NAME,
    value,
    path: '/',
    expires: Date.now() + COOKIE_TTL,
    sameSite: 'lax',
  })
}
