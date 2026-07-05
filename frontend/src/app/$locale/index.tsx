import { useI18n } from '@kanjou/react'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/button'
import { Input } from '#/components/input'
import { Loader } from '#/components/loader'

import { useShortenPage } from './-hooks'

export const Route = createFileRoute('/$locale/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { state, mutations, functions, features } = useShortenPage()

  const { t } = useI18n()

  return (
    <div className="flex w-180 flex-col mx-auto pt-48">
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <Input {...features.urlField.register()} placeholder={t('input.shorten.placeholder')} />
        <Button
          data-hidden={!state.isShortened}
          size="icon-lg"
          className="*:transition *:duration-150 *:ease-out data-[hidden=true]:scale-0 data-[hidden=true]:opacity-0 grid place-items-center *:col-start-1 *:row-start-1"
          onClick={functions.handleCopy}
        >
          <span
            data-copied={state.isCopied}
            className="i-material-symbols-content-copy-outline-sharp text-brand data-[copied=true]:scale-50 data-[copied=true]:opacity-0"
          />
          <span
            data-copied={state.isCopied}
            className="i-material-symbols-check scale-50 text-success opacity-0 data-[copied=true]:scale-100 data-[copied=true]:opacity-100"
          />
        </Button>
      </div>

      <div className="h-6 text-red-500">
        {features.urlField.error && t(features.urlField.error)}
      </div>

      <Button
        className="self-end mt-32 w-48"
        disabled={state.isShortenDisabled}
        onClick={functions.handleShorten}
      >
        {!mutations.shorten.isLoading && state.isShortened && t('button.clear')}
        {!mutations.shorten.isLoading && !state.isShortened && t('button.shorten')}
        {mutations.shorten.isLoading && <Loader />}
      </Button>
    </div>
  )
}
