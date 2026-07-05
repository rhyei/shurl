import { defineConfig } from 'oxfmt'

import oxfmtConfig from '../oxfmt.config.ts'

export default defineConfig({
  ...oxfmtConfig,
  ignorePatterns: [...oxfmtConfig.ignorePatterns, 'routeTree.gen.ts', 'generated/'],
})
