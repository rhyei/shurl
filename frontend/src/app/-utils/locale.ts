import type { Locale } from '@kanjou/react'

import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'

export const getLocale = createServerFn({ method: 'GET' }).handler(async () => {
  return (getCookie('locale') as Locale) || 'en'
})

export const setLocale = createServerFn({ method: 'POST' })
  .validator((locale: string) => locale)
  .handler(async ({ data }) => {
    setCookie('locale', data, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    })
  })
