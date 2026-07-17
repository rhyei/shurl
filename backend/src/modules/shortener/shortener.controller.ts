import type { Ctx } from '@enshou/core'

import { Controller, Get, Inject, Post, Use } from '@enshou/core'
import { ApiOperation, ApiResponse, ApiTag } from '@enshou/openapi'
import { validate } from '@enshou/valibot'

import type { ShortenerService } from './shortener.service'

import { GO_EVENT_TRACKER_MIDDLEWARE, RATE_LIMIT_SHORTEN_MIDDLEWARE } from './middleware'
import { GoRoute, ShortenRoute, ShortenResponse } from './schemas'
import { SHORTENER_SERVICE } from './shortener.service'

@ApiTag('Shortener')
@Controller()
export class ShortenController {
  @Inject(SHORTENER_SERVICE) shortener!: ShortenerService

  @ApiOperation({ summary: 'Shorten an URL', schema: ShortenRoute })
  @ApiResponse(201, { $ref: ShortenResponse })
  @Use(...validate(ShortenRoute), RATE_LIMIT_SHORTEN_MIDDLEWARE)
  @Post('/api/shorten')
  async shorten(c: Ctx<ShortenRoute>) {
    const body = c.req.valid('json')
    const data = await this.shortener.shorten(body.url)
    return c.json(data, 201)
  }

  @ApiOperation({ summary: 'Resolve shortened URL', schema: GoRoute })
  @ApiResponse(302, { description: 'Redirect to the original URL' })
  @Use(...validate(GoRoute), GO_EVENT_TRACKER_MIDDLEWARE)
  @Get('/g/:id')
  async go(c: Ctx<GoRoute>) {
    const params = c.req.valid('param')
    const originalUrl = await this.shortener.resolve(params.id)
    return c.redirect(originalUrl, 302)
  }
}
