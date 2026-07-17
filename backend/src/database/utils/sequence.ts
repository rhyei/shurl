import type { Token } from '@enshou/core'
import type { PgSequence } from 'drizzle-orm/pg-core'

import { Inject } from '@enshou/core'
import { sql } from 'drizzle-orm'

import type { Db } from '#/database'

import { DB } from '#/database'

interface SequenceState {
  currentValue: number
  maxValue: number
  fetchPromise: Promise<void> | null
}

export class SequenceService {
  @Inject(DB) db!: Db
  private readonly sequences = new Map<string, SequenceState>()

  async nextValue(sequence: PgSequence): Promise<number> {
    const name = sequence.seqName!
    const increment = Number(sequence.seqOptions?.increment ?? 1)

    let sequenceState = this.sequences.get(name)
    if (!sequenceState) {
      sequenceState = { currentValue: 0, maxValue: 0, fetchPromise: null }
      this.sequences.set(name, sequenceState)
    }

    while (sequenceState.currentValue >= sequenceState.maxValue) {
      sequenceState.fetchPromise ??= this.fetchNextBlock(name, increment, sequenceState)
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

export const SEQUENCE_SERVICE = Symbol() as Token<SequenceService>
