import type { PgSequence } from 'drizzle-orm/pg-core'

import { createToken, Inject } from '@enshou/di'
import { sql } from 'drizzle-orm'

import type { Db } from '#/database'

import { DB } from '#/database'

export const SEQUENCE_SERVICE = createToken<SequenceService>('SequenceService')

interface SequenceState {
  currentValue: number
  maxValue: number
  fetchPromise: Promise<void> | null
}

@Inject(DB)
export class SequenceService {
  private readonly sequences = new Map<string, SequenceState>()

  constructor(private readonly db: Db) {}

  async nextValue(sequence: PgSequence): Promise<number> {
    const name = sequence.seqName!
    const increment = Number(sequence.seqOptions?.increment ?? 1)

    let sequenceState = this.sequences.get(name)
    if (!sequenceState) {
      sequenceState = { currentValue: 0, maxValue: 0, fetchPromise: null }
      this.sequences.set(name, sequenceState)
    }

    while (sequenceState.currentValue >= sequenceState.maxValue) {
      if (!sequenceState.fetchPromise)
        sequenceState.fetchPromise = this.fetchNextBlock(name, increment, sequenceState)
      await sequenceState.fetchPromise
    }

    return sequenceState.currentValue++
  }

  private async fetchNextBlock(name: string, increment: number, state: SequenceState) {
    try {
      const result = await this.db.execute(sql`SELECT nextval('${sql.raw(name)}')`)
      const startId = Number(result[0].nextval as string)
      state.currentValue = startId
      state.maxValue = startId + increment
    } finally {
      state.fetchPromise = null
    }
  }
}
