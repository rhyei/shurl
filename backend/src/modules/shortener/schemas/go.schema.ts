import type { RouteSchema } from '@enshou/valibot'

import { defineSchema } from '@enshou/openapi'
import * as v from 'valibot'

const GoRouteParams = defineSchema(
  'GoParams',
  v.object({
    id: v.pipe(v.string(), v.regex(/^[a-zA-Z0-9]{1,6}$/), v.description('The short URL ID.')),
  }),
)

export const GoRoute = v.object({
  param: GoRouteParams,
}) satisfies RouteSchema
export type GoRoute = v.InferOutput<typeof GoRoute>
