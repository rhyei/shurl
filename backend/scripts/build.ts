import { rm } from 'node:fs/promises'

await rm('./dist', { recursive: true, force: true })

void Bun.build({
  entrypoints: ['./src/index.ts', './scripts/init.ts'],
  outdir: './dist',
  minify: true,
  target: 'bun',
  define: {
    'Bun.env.NODE_ENV': JSON.stringify(Bun.env.NODE_ENV || 'production'),
  },
}).then(console.log)
