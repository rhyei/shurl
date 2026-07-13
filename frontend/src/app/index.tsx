import { useI18n } from '@kanjou/react'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Loader } from '#/components/ui/loader'
import { Typography } from '#/components/ui/typography'

import { useShortenPage } from './-hooks'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { state, mutations, functions, features } = useShortenPage()

  const { t } = useI18n()

  return (
    <form className="flex w-180 flex-col mx-auto pt-48" onSubmit={functions.handleSubmit}>
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <Input
          {...features.urlField.register()}
          disabled={mutations.shorten.isPending}
          placeholder={t('input.shorten.placeholder')}
        />
        <Button
          size="icon-lg"
          className="*:transition *:duration-150 *:ease-out aria-[hidden=true]:scale-0 aria-[hidden=true]:rounded-md rounded-none data-[hidden=true]:opacity-0 grid place-items-center *:col-start-1 *:row-start-1 group"
          title={t('button.copy-shortened.title')}
          onClick={functions.handleCopy}
          tabIndex={state.isShortened ? 0 : -1}
          data-copied={state.isCopied}
          aria-hidden={!state.isShortened}
          aria-label={t('button.copy-shortened.aria-label')}
        >
          <span
            className="i-material-symbols-content-copy-outline-sharp text-brand group-data-[copied=true]:scale-50 group-data-[copied=true]:opacity-0"
            aria-hidden
          />
          <span
            className="i-material-symbols-check scale-50 text-success opacity-0 group-data-[copied=true]:scale-100 group-data-[copied=true]:opacity-100"
            aria-hidden
          />
        </Button>
      </div>

      <Typography variant="caption" className="mt-2 inline-block h-6 text-error">
        {state.url && features.urlField.error && t(features.urlField.error)}
      </Typography>

      <Button className="self-end mt-32 w-48" disabled={mutations.shorten.isPending} type="submit">
        {!mutations.shorten.isPending && state.isShortened && t('button.clear')}
        {!mutations.shorten.isPending && !state.isShortened && t('button.shorten')}
        {mutations.shorten.isPending && <Loader />}
      </Button>

      <Typography variant="caption" className="text-muted self-end mt-2 text-sm">
        {t('recaptcha')}
      </Typography>
    </form>
  )
}
