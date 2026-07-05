import { useI18n } from '@kanjou/react'
import { createFileRoute } from '@tanstack/react-router'

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
    <div className="mt-64 w-180 relative mx-auto flex flex-col">
      <div className="gap-4 flex justify-between">
        <Input
          {...features.urlField.register()}
          placeholder={t('input.shorten.placeholder')}
          className="flex-1"
        />

        <Button
          data-hidden={!state.isShortened}
          size="icon-lg"
          className="ease-out transition-all duration-200 data-[hidden=true]:scale-0 data-[hidden=true]:opacity-0"
          onClick={functions.handleCopy}
        >
          <span
            data-copied={state.isCopied}
            className="i-material-symbols-content-copy-outline-sharp text-brand ease-out absolute transition-all duration-200 data-[copied=true]:scale-50 data-[copied=true]:opacity-0"
          />
          <span
            data-copied={state.isCopied}
            className="i-material-symbols-check text-green-500 ease-out absolute scale-50 opacity-0 transition-all duration-200 data-[copied=true]:scale-100 data-[copied=true]:opacity-100"
          />
        </Button>
      </div>

      <div className="h-6 text-red-500 select-none">
        {!!state.url && features.urlField.error && t(features.urlField.error)}
      </div>
      <Button
        className="mt-32 w-48 self-end"
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
