import { defineSchema } from '@enshou/openapi'
import * as v from 'valibot'

export const ErrorResponse = defineSchema(
  'ErrorResponse',
  v.object({
    error: v.object({
      name: v.string(),
      status: v.number(),
      details: v.optional(v.any()),
    }),
  }),
)
