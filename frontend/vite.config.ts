import { kanjou } from '@kanjou/vite'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import 'dotenv/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    kanjou({
      sourceLocalePath: './src/assets/locales/en.json',
      dts: {
        outputDirectory: './generated',
      },
    }),
    tanstackStart({
      router: {
        routesDirectory: 'app',
        generatedRouteTree: '../generated/routeTree.gen.ts',
      },
    }),
    react(),
    tailwindcss(),
    nitro({
      preset: 'bun',
      output: {
        dir: 'dist',
      },
      routeRules: {
        '/api/**': { proxy: `${process.env.BACKEND_URL}/api/**` },
      },
    }),
  ],
})
