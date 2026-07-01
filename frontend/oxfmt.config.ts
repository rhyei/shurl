import { defineConfig } from 'oxfmt'

import baseConfig from '../oxfmt.config.ts'

export default defineConfig({
  ...baseConfig,
  sortTailwindcss: {
    stylesheet: './src/styles.css',
    functions: ['cva', 'cn'],
  },
  ignorePatterns: [...baseConfig.ignorePatterns, 'routeTree.gen.ts', 'generated/', '.output/'],
})
