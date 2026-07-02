import type { PostApiShortenData } from '#/api'

import { postApiShorten } from '#/api'
import { useCopy, useField, useMutation } from '#/hooks'

export function useIndexPage() {
  const copy = useCopy()

  const urlField = useField('', { validateOnBlur: true, validateOnChange: true })

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
    if (shortenMutation.data?.data) await copy.copy(shortenMutation.data.data.shortUrl)
  }

  const url = urlField.watch().trim()
  const isShortened = url === shortenMutation.data?.data?.shortUrl
  const isShortenDisabled = !url || !!urlField.error || shortenMutation.isLoading

  return {
    state: {
      url,
      isShortened,
      isShortenDisabled,
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
      copy,
    },
  }
}
