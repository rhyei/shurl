import { createToken, Inject } from '@enshou/di'

import type { Db } from '#/database'

import { DB, GUEST_URLS_ID_SEQ_INCREMENT, GUEST_URLS_ID_SEQ_NAME } from '#/database'
import { Sequence } from '#/database/utils'

export const GUEST_URLS_ID_SEQUENCE = createToken<GuestUrlsIdSequence>('GuestUrlsIdSequence')

@Inject(DB)
export class GuestUrlsIdSequence extends Sequence {
  protected readonly sequenceName = GUEST_URLS_ID_SEQ_NAME
  protected readonly step = GUEST_URLS_ID_SEQ_INCREMENT

  constructor(db: Db) {
    super(db)
  }
}
