import { defineConfig } from 'oxfmt'

import oxfmtConfig from '../oxfmt.config.ts'

export default defineConfig({
  ...oxfmtConfig,
  sortTailwindcss: {
    stylesheet: './src/styles.css',
    functions: ['cva', 'cn'],
  },
  ignorePatterns: [...oxfmtConfig.ignorePatterns, 'routeTree.gen.ts', 'generated/', '.output/'],
})
