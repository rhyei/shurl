import type { ResponseSchema, RouteSchema } from '@enshou/valibot'

import { defineResponse, defineSchema } from '@enshou/openapi'
import * as v from 'valibot'

export const ShortenRouteJson = defineSchema(
  'ShortenRouteBody',
  v.object({
    url: v.pipe(v.string(), v.url(), v.description('The URL to shorten.')),
    googleReCaptcha: v.pipe(
      v.optional(v.string()),
      v.description('Required if you are creating more than 5 links per hour.'),
    ),
  }),
)

export const ShortenRoute = v.object({
  json: ShortenRouteJson,
}) satisfies RouteSchema
export type ShortenRoute = v.InferOutput<typeof ShortenRoute>

const ShortenResponseBody = defineSchema(
  'ShortenResponseBody',
  v.pipe(
    v.object({
      id: v.string(),
      originalUrl: v.string(),
      shortUrl: v.string(),
    }),
    v.description('The shortened URL response body.'),
  ),
)

export const ShortenResponse = defineResponse(
  'ShortenResponse',
  v.pipe(
    v.object({
      json: ShortenResponseBody,
    }),
    v.description('The shortened URL response.'),
  ),
) satisfies ResponseSchema
