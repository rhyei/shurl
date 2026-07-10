import { defineConfig } from 'oxfmt'

export default defineConfig({
  singleQuote: true,
  semi: false,
  sortImports: {
    customGroups: [{ groupName: 'virtual', elementNamePattern: ['virtual:*', 'virtual:*/*'] }],
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
