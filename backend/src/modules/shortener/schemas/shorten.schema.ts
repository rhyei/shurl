import type { InferSchema, RouteSchema } from '@enshou/valibot'

import { defineSchema } from '@enshou/openapi'
import * as v from 'valibot'

export const ShortenSchema = {
  json: v.object({
    url: v.pipe(v.string(), v.url(), v.description('The URL to shorten.')),
    googleReCaptcha: v.pipe(
      v.optional(v.string()),
      v.description('Required if you are creating more than 5 links per hour.'),
    ),
  }),
} satisfies RouteSchema
export type ShortenSchema = InferSchema<typeof ShortenSchema>

export const ShortenResponse = defineSchema(
  'ShortenResponse',
  v.pipe(
    v.object({
      id: v.string(),
      originalUrl: v.string(),
      shortUrl: v.string(),
    }),
    v.description('The shortened URL response.'),
  ),
)
