import { updateDb } from 'ip-location-api'
import { mkdirSync } from 'node:fs'

try {
  mkdirSync('/app/geo', { recursive: true })

  await updateDb({
    fields: 'country',
    dataDir: '/app/geo',
    tmpDataDir: '/tmp',
    autoUpdate: 'false',
    apiDir: process.cwd() + '/node_modules/ip-location-api',
  })

  console.log('[Update Geo DB] Successfully updated')
} catch (error) {
  console.error('[Update Geo DB] Failed:', error)
  process.exit(1)
}
