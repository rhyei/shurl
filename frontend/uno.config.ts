import { defineConfig, presetIcons, presetMini, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetMini(),
    presetIcons(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        mono: ['JetBrains Mono:400,500', 'monospace'],
      },
    }),
  ],
  theme: {
    colors: {
      surface: '#222222',
      background: '#1e1e1e',
      muted: '#414141',
      brand: '#eb6822',
    },
  },
})
