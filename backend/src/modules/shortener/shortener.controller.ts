import type { Ctx } from '@enshou/core'

import { Controller, Get, Post, Use } from '@enshou/core'
import { Inject } from '@enshou/di'
import { ApiOperation, ApiTag } from '@enshou/openapi'
import { validate } from '@enshou/valibot'

import { ErrorResponse } from '#/common/schemas/error-response.schema'
import { GO_EVENT_TRACKER_MIDDLEWARE } from '#/modules/shortener/middleware/go-event-tracker.middleware'

import type { ShortenerService } from './shortener.service'

import { GoSchema } from './schemas/go.schema'
import { ShortenSchema, ShortenResponse } from './schemas/shorten.schema'
import { SHORTENER_SERVICE } from './shortener.service'

@ApiTag('Shortener')
@Controller()
@Inject(SHORTENER_SERVICE)
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @ApiOperation({
    summary: 'Shorten an URL',
    schema: ShortenSchema,
    responses: {
      200: { description: 'Successfully shortened an URL', schema: ShortenResponse },
      400: { description: 'Error shortening URL', schema: ErrorResponse },
    },
  })
  @Use(...validate(ShortenSchema))
  @Post('/api/shorten')
  async shorten(c: Ctx<ShortenSchema>) {
    const { url } = c.req.valid('json')
    const data = await this.shortenerService.shorten(url)
    return c.json(data)
  }

  @ApiOperation({
    summary: 'Resolve shortened URL slug',
    schema: GoSchema,
    responses: {
      302: { description: 'Redirect to the original URL' },
      404: { description: 'Shortened URL not found', schema: ErrorResponse },
    },
  })
  @Use(...validate(GoSchema), GO_EVENT_TRACKER_MIDDLEWARE)
  @Get('/g/:id')
  async go(c: Ctx<GoSchema>) {
    const { id } = c.req.valid('param')
    const originalUrl = await this.shortenerService.resolve(id)
    return c.redirect(originalUrl, 302)
  }
}
