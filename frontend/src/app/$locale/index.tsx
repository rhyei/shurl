import { useI18n } from '@kanjou/react'
import { createFileRoute } from '@tanstack/react-router'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { Button } from '#/components/button'
import { Input } from '#/components/input'
import { Loader } from '#/components/loader'

import { useIndexPage } from './-hooks'

export const Route = createFileRoute('/$locale/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { state, mutations, functions, features } = useIndexPage()

  const { t } = useI18n()

  return (
    <div className="relative mx-auto mt-64 flex w-180 flex-col">
      <div className="flex justify-between gap-4">
        <Input
          {...features.urlField.register()}
          placeholder={t('input.shorten.placeholder')}
          className="flex-1"
        />

        <Button
          data-hidden={!state.isShortened}
          size="icon-lg"
          className="transition-all duration-200 ease-out data-[hidden=true]:scale-0 data-[hidden=true]:opacity-0"
          onClick={functions.handleCopy}
        >
          <CopyIcon
            data-copied={state.isCopied}
            className="absolute text-brand transition-all duration-200 ease-out data-[copied=true]:scale-50 data-[copied=true]:opacity-0"
          />
          <CheckIcon
            data-copied={state.isCopied}
            className="absolute scale-50 text-green-500 opacity-0 transition-all duration-200 ease-out data-[copied=true]:scale-100 data-[copied=true]:opacity-100"
          />
        </Button>
      </div>

      <div className="h-6 text-red-500 select-none">
        {!!state.url && features.urlField.error && t(features.urlField.error)}
      </div>

      <Button
        className="mt-32 w-52 self-end"
        disabled={state.isShortenDisabled}
        onClick={functions.handleShorten}
      >
        {state.isShortened && t('button.clear')}
        {!state.isShortened && t('button.shorten')}
        {mutations.shorten.isLoading && <Loader />}
      </Button>
    </div>
  )
}
