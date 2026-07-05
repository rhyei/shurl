import { createToken, Inject } from '@enshou/di'

import type { Db } from '#/database'

import { DB, guestUrlsIdSeq } from '#/database'
import { Sequence } from '#/database/utils'

export const GUEST_URLS_ID_SEQUENCE = createToken<GuestUrlsIdSequence>('GuestUrlsIdSequence')

@Inject(DB)
export class GuestUrlsIdSequence extends Sequence {
  protected readonly name = guestUrlsIdSeq.seqName!
  protected readonly increment = Number(guestUrlsIdSeq.seqOptions?.increment)

  constructor(db: Db) {
    super(db)
  }
}
