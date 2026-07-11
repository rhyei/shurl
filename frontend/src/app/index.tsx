import { useI18n } from '@kanjou/react'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Loader } from '#/components/ui/loader'
import { Typography } from '#/components/ui/typography'

import { useShortenPage } from './-hooks'

export const Route = createFileRoute('/')({ component: RouteComponent })

function RouteComponent() {
  const { state, mutations, functions, features } = useShortenPage()

  const { t } = useI18n()

  return (
    <div className="flex w-180 flex-col mx-auto pt-48">
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <Input
          {...features.urlField.register()}
          disabled={mutations.shorten.isPending}
          placeholder={t('input.shorten.placeholder')}
        />
        <Button
          size="icon-lg"
          className="*:transition *:duration-150 *:ease-out data-[hidden=true]:scale-0 data-[hidden=true]:opacity-0 grid place-items-center *:col-start-1 *:row-start-1"
          data-hidden={!state.isShortened}
          onClick={functions.handleCopy}
        >
          <span
            className="i-material-symbols-content-copy-outline-sharp text-brand data-[copied=true]:scale-50 data-[copied=true]:opacity-0"
            data-copied={state.isCopied}
          />
          <span
            className="i-material-symbols-check scale-50 text-success opacity-0 data-[copied=true]:scale-100 data-[copied=true]:opacity-100"
            data-copied={state.isCopied}
          />
        </Button>
      </div>

      <Typography variant="caption" className="mt-2 inline-block h-6 text-error">
        {state.url && features.urlField.error && t(features.urlField.error)}
      </Typography>
      <Button
        className="self-end mt-32 w-48"
        disabled={mutations.shorten.isPending}
        onClick={functions.handleShorten}
      >
        {!mutations.shorten.isPending && state.isShortened && t('button.clear')}
        {!mutations.shorten.isPending && !state.isShortened && t('button.shorten')}
        {mutations.shorten.isPending && <Loader />}
      </Button>
    </div>
  )
}
