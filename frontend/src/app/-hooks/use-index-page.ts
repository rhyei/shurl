import { useMutation } from '@tanstack/react-query'
import * as v from 'valibot'

import { postApiShortenMutation } from '#/api/tanstack'
import { useCopy } from '#/hooks'

import { useField } from './use-field'

const UrlFieldSchema = v.pipe(
  v.string(),
  v.trim(),
  v.transform((input) => (/^https?:\/\//i.test(input) ? input : `https://${input}`)),
  v.url('validation.invalid-url'),
)

export function useShortenPage() {
  const { copy, copied: isCopied } = useCopy()

  const urlField = useField('', {
    schema: UrlFieldSchema,
    validateOnBlur: true,
    validateOnChange: true,
  })

  const shortenMutation = useMutation(postApiShortenMutation())

  const handleShorten = async () => {
    if (isShortened) return urlField.setValue('')

    const shortenResponse = await shortenMutation.mutateAsync({
      body: { url: url.startsWith('http') ? url : `https://${url}` },
    })

    if (shortenResponse?.shortUrl) urlField.setValue(shortenResponse.shortUrl)
  }

  const handleCopy = () => {
    if (shortenMutation.data) void copy(shortenMutation.data.shortUrl)
  }

  const url = urlField.watch().trim()
  const isShortened = url === shortenMutation.data?.shortUrl
  const isShortenDisabled =
    (!url && urlField.touched) || !!urlField.error || shortenMutation.isPending

  return {
    state: {
      isCopied,
      isShortened,
      isShortenDisabled,
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
