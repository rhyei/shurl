import { defineConfig } from 'oxfmt'

import baseConfig from '../oxfmt.config.ts'

export default defineConfig({
  ...baseConfig,
  ignorePatterns: ['routeTree.gen.ts', 'generated/'],
})
