import { defineConfig, presetIcons, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
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
      background: '#1e1e1e',
      surface: '#222222',
      foreground: '#e5e5e5',
      muted: '#414141',
      brand: '#eb6822',
      success: '#22c55e',
      selection: '#eb68223f',
    },
  },
})
