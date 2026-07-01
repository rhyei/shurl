import { sql } from 'drizzle-orm'

import type { Db } from '#/database'

export abstract class Sequence {
  private currentValue = 0
  private maxValue = 0
  private fetchPromise: Promise<void> | null = null

  protected abstract readonly sequenceName: string
  protected abstract readonly step: number

  constructor(protected readonly db: Db) {}

  async nextValue(): Promise<number> {
    while (this.currentValue >= this.maxValue) {
      if (!this.fetchPromise) this.fetchPromise = this.fetchNextBlock()
      await this.fetchPromise
    }

    return this.currentValue++
  }

  private async fetchNextBlock() {
    try {
      const result = await this.db.execute(sql`SELECT nextval('${sql.raw(this.sequenceName)}')`)
      const startId = Number(result[0].nextval as string)
      this.currentValue = startId
      this.maxValue = startId + this.step
    } finally {
      this.fetchPromise = null
    }
  }
}
