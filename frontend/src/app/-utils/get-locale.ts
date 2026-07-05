import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const getLocale = createServerFn({ method: 'GET' }).handler(async () => {
  return getCookie('locale') || 'en'
})
