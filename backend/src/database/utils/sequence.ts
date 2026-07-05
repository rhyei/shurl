import { sql } from 'drizzle-orm'

import type { Db } from '#/database'

export abstract class Sequence {
  protected abstract readonly name: string
  protected abstract readonly increment: number

  private currentValue = 0
  private maxValue = 0
  private fetchPromise: Promise<void> | null = null

  constructor(protected readonly db: Db) {}

  private async fetchNextBlock() {
    try {
      const result = await this.db.execute(sql`SELECT nextval('${sql.raw(this.name)}')`)
      const startId = Number(result[0].nextval as string)
      this.currentValue = startId
      this.maxValue = startId + this.increment
    } finally {
      this.fetchPromise = null
    }
  }

  async nextValue(): Promise<number> {
    while (this.currentValue >= this.maxValue) {
      if (!this.fetchPromise) this.fetchPromise = this.fetchNextBlock()
      await this.fetchPromise
    }

    return this.currentValue++
  }
}
