import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import 'dotenv/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart({
      router: {
        routesDirectory: 'app',
        generatedRouteTree: '../generated/routeTree.gen.ts',
      },
    }),
    nitro({
      preset: 'bun',
      routeRules: {
        '/api/**': { proxy: `${process.env.BACKEND_URL}/api/**` },
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
})
