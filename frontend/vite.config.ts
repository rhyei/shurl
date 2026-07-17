import { kanjou } from '@kanjou/vite'
import { devtools as tanstackDevtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import unoCss from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
  return {
    resolve: { tsconfigPaths: true },
    plugins: [
      tanstackDevtools(),
      unoCss({ mode: command === 'build' ? 'per-module' : 'global' }),
      kanjou({
        sourceLocalePath: './src/assets/locales/en.json',
        dts: { outputDirectory: './generated' },
      }),
      tanstackStart({
        router: {
          routesDirectory: 'app',
          generatedRouteTree: '../generated/routeTree.gen.ts',
        },
      }),
      react(),
      nitro({
        preset: 'bun',
        output: { dir: 'dist' },
        routeRules: { '/api/**': { proxy: `${Bun.env.BACKEND_URL}/api/**` } },
      }),
    ],
  }
})
