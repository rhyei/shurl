import { pgSequence, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const guestUrlsIdSeq = pgSequence('guest_urls_id_seq', {
  startWith: 1,
  increment: 100_000,
})

export const guestUrls = pgTable('guest_urls', {
  id: varchar({ length: 6 }).primaryKey(),
  originalUrl: text('original_url').notNull(),
})
