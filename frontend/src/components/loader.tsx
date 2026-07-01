import type { ComponentProps } from 'react'

import { Loader2Icon } from 'lucide-react'

import { cn } from '#/utils'

export type LoaderProps = ComponentProps<'svg'>

export function Loader({ className, ...props }: LoaderProps) {
  return <Loader2Icon {...props} className={cn('shrink-0 animate-spin text-1.5', className)} />
}
