import { defineConfig } from 'oxfmt'

export default defineConfig({
  semi: false,
  singleQuote: true,
  printWidth: 100,
  arrowParens: 'always',
  trailingComma: 'all',
  useTabs: false,
  tabWidth: 2,
  quoteProps: 'consistent',
  sortImports: {
    customGroups: [{ elementNamePattern: ['virtual:*', 'virtual:*/*'], groupName: 'virtual' }],
    groups: [
      ['type-builtin', 'type-external'],
      ['value-builtin', 'value-external'],
      'type-internal',
      'value-internal',
      ['type-parent', 'type-sibling', 'type-index'],
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown',
      'virtual',
    ],
  },
})
