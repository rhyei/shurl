import { pgSequence, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const GUEST_URLS_ID_SEQ_NAME = 'guest_urls_id_seq'
export const GUEST_URLS_ID_SEQ_INCREMENT = 100_000
export const guestUrlsIdSeq = pgSequence(GUEST_URLS_ID_SEQ_NAME, {
  startWith: 1,
  increment: GUEST_URLS_ID_SEQ_INCREMENT,
})

export const guestUrls = pgTable('guest_urls', {
  id: varchar({ length: 6 }).primaryKey(),
  originalUrl: text('original_url').notNull(),
})
