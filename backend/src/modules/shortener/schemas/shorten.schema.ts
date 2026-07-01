import type { InferSchema, RouteSchema } from '@enshou/valibot'

import { defineSchema } from '@enshou/openapi'
import * as v from 'valibot'

export const ShortenSchema = {
  json: v.object({
    url: v.pipe(v.string(), v.url()),
  }),
} as const satisfies RouteSchema
export type ShortenSchema = InferSchema<typeof ShortenSchema>

export const ShortenResponse = defineSchema(
  'ShortenResponse',
  v.object({
    id: v.string(),
    originalUrl: v.string(),
    shortUrl: v.string(),
  }),
)
