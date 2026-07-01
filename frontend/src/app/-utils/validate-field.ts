import * as v from 'valibot'

export function validateField(schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>) {
  return (value: unknown) => {
    const result = v.safeParse(schema, value)
    if (!result.success) return result.issues[0].message
    return true
  }
}
