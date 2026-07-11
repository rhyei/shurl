import { useI18n } from '@kanjou/react'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, isAxiosError } from 'axios'
import { useEffect, useRef } from 'react'
import * as v from 'valibot'

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

  const { copy, copied: isCopied } = useCopy()

  const urlField = useField('', {
    validateOnBlur: true,
    validate: validateAdapter(UrlFieldSchema),
  })

  const shortenMutation = useMutation(postApiShortenMutation())

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleShorten = async () => {
    if (!url) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      const originalPlaceholder = urlField.ref.current!.placeholder

      urlField.ref.current!.placeholder = t('input.shorten.placeholder-highlight')
      urlField.focus()

      timeoutRef.current = setTimeout(() => {
        if (timeoutRef.current) urlField.ref.current!.placeholder = originalPlaceholder
      }, 1500)

      return
    }

    if (isShortened) {
      urlField.setValue('')
      shortenMutation.reset()
      return
    }

    try {
      const shortenResponse = await shortenMutation.mutateAsync({
        body: { url: /^https?:\/\//i.test(url) ? url : `https://${url}` },
      })

      urlField.setValue(shortenResponse.shortUrl)
    } catch (error) {
      if (!isAxiosError(error)) throw error
      if (error.code === AxiosError.ERR_NETWORK && window.navigator.onLine)
        urlField.setError('error.network')
      if (error.code === AxiosError.ERR_NETWORK && !window.navigator.onLine)
        urlField.setError('error.offline')
      if (error.status! < 200 || error.status! >= 300) urlField.setError('error.server')
    }
  }

  const handleCopy = () => {
    if (shortenMutation.data) void copy(shortenMutation.data.shortUrl)
  }

  const url = urlField.watch()
  const isShortened = url === shortenMutation.data?.shortUrl && shortenMutation.isSuccess

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current ?? undefined)
    },
    [],
  )

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
      handleShorten,
    },
    features: {
      urlField,
    },
  }
}
