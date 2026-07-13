import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { GoogleReCaptchaProvider } from '@google-recaptcha/react'
import { I18nProvider } from '@kanjou/react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { client } from '#/api/client'

import 'virtual:uno.css'
import { getLocale } from './-utils/locale'

import '#/assets/styles/global.css'

import localeLoaders from 'virtual:kanjou/modules'

client.setConfig({
  baseURL: typeof window === 'undefined' ? Bun.env.BACKEND_URL : '',
})

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
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
  loader: async () => {
    const locale = await getLocale()
    const { default: messages } = await localeLoaders[locale]()
    return { locale, messages }
  },
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
        <GoogleReCaptchaProvider type="v3" siteKey={import.meta.env.VITE_GOOGLE_RECAPTCHA_KEY}>
          <I18nProvider locale={locale} messages={messages}>
            {children}
          </I18nProvider>
        </GoogleReCaptchaProvider>
        <TanStackDevtools
          plugins={[
            { name: 'TanStack Query', render: <ReactQueryDevtoolsPanel /> },
            { name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
