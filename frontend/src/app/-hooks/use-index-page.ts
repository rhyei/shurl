import type { SubmitEventHandler } from 'react'

import { useGoogleReCaptcha } from '@google-recaptcha/react'
import { useI18n } from '@kanjou/react'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, isAxiosError } from 'axios'
import { useEffect, useRef } from 'react'
import * as v from 'valibot'

import type { TimeoutId } from '#/types'

import { postApiShortenMutation } from '#/api/tanstack'
import { validateAdapter } from '#/app/-utils/validate-adapter'
import { useCopy } from '#/hooks'
import { useField } from '#/hooks/use-field'

const UrlFieldSchema = v.pipe(
  v.string(),
  v.trim(),
  v.transform((input) => (/^https?:\/\//i.test(input) ? input : `https://${input}`)),
  v.url('validation.invalid-url'),
)

export function useShortenPage() {
  const { t } = useI18n()

  const googleReCaptcha = useGoogleReCaptcha()

  const { copy, copied: isCopied } = useCopy()

  const urlField = useField('', {
    validateOnBlur: true,
    validate: validateAdapter(UrlFieldSchema),
  })

  const shortenMutation = useMutation(postApiShortenMutation())

  const timeoutRef = useRef<TimeoutId | undefined>(undefined)

  const handleSubmit: SubmitEventHandler = async (event) => {
    event.preventDefault()

    if (isShortened) {
      urlField.setValue('')
      shortenMutation.reset()
      return
    }

    if (!url) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      urlField.ref.current!.placeholder = t('input.shorten.placeholder-alert')
      urlField.focus()

      timeoutRef.current = setTimeout(() => {
        urlField.ref.current!.placeholder = t('input.shorten.placeholder')
      }, 1500)

      return
    }

    try {
      const googleReCaptchaToken = await googleReCaptcha
        .executeV3?.('shorten')
        .catch(() => undefined)

      const shortenResponse = await shortenMutation.mutateAsync({
        body: {
          url: /^https?:\/\//i.test(url) ? url : `https://${url}`,
          googleReCaptcha: googleReCaptchaToken,
        },
      })

      urlField.setValue(shortenResponse.shortUrl)
      urlField.setError('')
    } catch (error) {
      if (!isAxiosError(error)) throw error
      if (error.code === AxiosError.ERR_NETWORK && window.navigator.onLine)
        urlField.setError('error.network')
      if (error.code === AxiosError.ERR_NETWORK && !window.navigator.onLine)
        urlField.setError('error.offline')
      if (error.status === 429) return urlField.setError('error.ratelimit')
      if (error.status! < 200 || error.status! >= 300) urlField.setError('error.server')
    }
  }

  const handleCopy = () => {
    if (shortenMutation.data) void copy(shortenMutation.data.shortUrl)
  }

  const url = urlField.watch()
  const isShortened = url === shortenMutation.data?.shortUrl && shortenMutation.isSuccess

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return {
    state: {
      url,
      isCopied,
      isShortened,
    },
    mutations: {
      shorten: shortenMutation,
    },
    functions: {
      handleCopy,
      handleSubmit,
    },
    features: {
      urlField,
    },
  }
}
