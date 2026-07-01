import { createFileRoute } from '@tanstack/react-router'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { validateField } from '#/app/-utils/validate-field'
import { Button } from '#/components/button'
import { Input } from '#/components/input'
import { Loader } from '#/components/loader'

import { useIndexPage } from './-hooks/use-index-page'
import { UrlSchema } from './-schemas/url-schema'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const { state, mutations, functions, features } = useIndexPage()

  return (
    <div className="mx-auto mt-64 flex w-180 flex-col">
      <div className="flex justify-between gap-4">
        <Input
          {...features.urlField.register({ validate: validateField(UrlSchema) })}
          placeholder="https://google.com/..."
          className="flex-1"
        />

        <Button
          data-hidden={!state.isShortened}
          size="icon-lg"
          className="transition-all duration-200 ease-out data-[hidden=true]:scale-0 data-[hidden=true]:opacity-0"
          onClick={functions.handleCopy}
        >
          <CopyIcon
            data-copied={features.copy.copied}
            className="absolute text-brand transition-all duration-200 ease-out data-[copied=true]:scale-50 data-[copied=true]:opacity-0"
          />
          <CheckIcon
            data-copied={features.copy.copied}
            className="absolute scale-50 text-green-500 opacity-0 transition-all duration-200 ease-out data-[copied=true]:scale-100 data-[copied=true]:opacity-100"
          />
        </Button>
      </div>

      <div className="h-6 text-red-500 select-none">{!!state.url && features.urlField.error}</div>

      <Button
        disabled={state.isShortenDisabled}
        className="mt-32 w-52 self-end"
        onClick={functions.handleShorten}
      >
        {state.isShortened && 'CLEAR'}
        {!state.isShortened && 'SHORTEN'}
        {mutations.shorten.isLoading && <Loader />}
      </Button>
    </div>
  )
}
