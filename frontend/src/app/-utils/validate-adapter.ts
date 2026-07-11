import type { GenericSchema, InferInput } from 'valibot'

import { safeParse } from 'valibot'

export function validateAdapter<Schema extends GenericSchema>(schema: Schema) {
  return (value: InferInput<Schema>): string | true => {
    const result = safeParse(schema, value)
    if (result.success) return true
    return result.issues[0].message
  }
}
