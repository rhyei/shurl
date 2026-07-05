import type { Locale } from '@kanjou/react'

import { I18nProvider } from '@kanjou/react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import locales from 'virtual:kanjou/modules'

export const Route = createFileRoute('/$locale')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const locale = params.locale as Locale
    const messages = await locales[locale]()
    return { locale, messages: messages.default }
  },
})

function RouteComponent() {
  const { locale, messages } = Route.useLoaderData()

  return (
    <I18nProvider locale={locale} messages={messages}>
      <Outlet />
    </I18nProvider>
  )
}
