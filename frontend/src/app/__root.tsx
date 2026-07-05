import type { ReactNode } from 'react'

import { HeadContent, Scripts, createRootRoute, useParams } from '@tanstack/react-router'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { client } from '../../generated/api/client.gen'

client.setConfig({
  baseUrl: '/',
})

client.interceptors.request.use((request) => {
  if (typeof window === 'undefined') return request

  const locale = window.location.pathname.split('/')[1] || 'en'
  request.headers.set('Accept-Language', locale)
  return request
})

export const Route = createRootRoute({
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
  const params = useParams({ strict: false })

  const locale = params.locale || 'en'

  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground min-h-screen font-mono antialiased selection:bg-selection">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
