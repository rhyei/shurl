import { rmSync } from 'node:fs'

try {
  rmSync('./dist', { recursive: true, force: true })

  const result = await Bun.build({
    entrypoints: ['./src/index.ts', './scripts/init.ts'],
    outdir: './dist',
    minify: true,
    target: 'bun',
    define: {
      'Bun.env.NODE_ENV': JSON.stringify(Bun.env.NODE_ENV || 'production'),
    },
  })
  console.log(result)
} catch (error) {
  console.error('[Build] Failed:', error)
  process.exit(1)
}
