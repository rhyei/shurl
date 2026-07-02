try {
  await Bun.sql`DROP SCHEMA IF EXISTS public CASCADE;`
  await Bun.sql`CREATE SCHEMA public;`

  await Bun.sql`GRANT ALL ON SCHEMA public TO postgres;`
  await Bun.sql`GRANT ALL ON SCHEMA public TO public;`

  console.log('[PG Reset] Database reset successfully')
} catch (error) {
  console.error('[PG Reset] Failed:', error)
  process.exit(1)
}

export {}
