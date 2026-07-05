import * as v from 'valibot'

import type { PostApiShortenData } from '#/api'

import { postApiShorten } from '#/api'
import { useField } from '#/app/-hooks'
import { useCopy, useMutation } from '#/hooks'

const UrlFieldSchema = v.pipe(
  v.string(),
  v.trim(),
  v.transform((input) => (/^https?:\/\//i.test(input) ? input : `https://${input}`)),
  v.url('validation.invalid-url'),
)

export function useIndexPage() {
  const { copy, copied: isCopied } = useCopy()

  const urlField = useField('', {
    schema: UrlFieldSchema,
    validateOnBlur: true,
    validateOnChange: true,
  })

  const shortenMutation = useMutation((body: PostApiShortenData['body']) =>
    postApiShorten({ body }),
  )

  const handleShorten = async () => {
    if (isShortened) return urlField.setValue('')

    let url = urlField.getValue()
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`

    const shortenResponse = await shortenMutation.mutateAsync({ url })

    if (shortenResponse.error) urlField.setError(shortenResponse.error.error?.name)
    else urlField.setValue(shortenResponse.data.shortUrl)
  }

  const handleCopy = async () => {
    if (shortenMutation.data?.data) await copy(shortenMutation.data.data.shortUrl)
  }

  const url = urlField.watch().trim()
  const isShortened = url === shortenMutation.data?.data?.shortUrl
  const isShortenDisabled = !url || !!urlField.error || shortenMutation.isLoading

  return {
    state: {
      url,
      isShortened,
      isShortenDisabled,
      isCopied,
    },
    mutations: {
      shorten: shortenMutation,
    },
    functions: {
      handleShorten,
      handleCopy,
    },
    features: {
      urlField,
    },
  }
}
