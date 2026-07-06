import type { ReactNode } from 'react'

import { I18nProvider } from '@kanjou/react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import locales from 'virtual:kanjou/modules'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { client } from '../../generated/api/client.gen'
import { getLocale } from './-utils/locale'

client.setConfig({
  baseUrl: '/',
})

export const Route = createRootRoute({
  loader: async () => {
    const locale = await getLocale()
    const messages = await locales[locale]()
    return { locale, messages: messages.default }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Shurl' },
    ],
    links: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  shellComponent: Root,
})

function Root({ children }: { children: ReactNode }) {
  const { locale, messages } = Route.useLoaderData()

  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground min-h-screen font-mono antialiased selection:bg-selection">
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
        <Scripts />
      </body>
    </html>
  )
}
