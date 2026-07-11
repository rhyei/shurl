import type { InferSchema, RouteSchema } from '@enshou/valibot'

import * as v from 'valibot'

export const GoSchema = {
  param: v.object({
    id: v.pipe(v.string(), v.regex(/^[a-zA-Z0-9]{1,6}$/), v.description('The short URL ID.')),
  }),
} as const satisfies RouteSchema
export type GoSchema = InferSchema<typeof GoSchema>
