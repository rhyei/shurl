import { createFileRoute, redirect } from '@tanstack/react-router'

import { getLocale } from './-utils/get-locale'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const locale = await getLocale()
    throw redirect({
      to: '/$locale',
      params: { locale },
    })
  },
})
