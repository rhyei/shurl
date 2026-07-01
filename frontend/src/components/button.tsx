import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cva } from 'class-variance-authority'

import { cn } from '#/utils/cn'

export const buttonVariants = cva('flex cursor-pointer items-center justify-center gap-1.5', {
  variants: {
    variant: {
      contained:
        'bg-background text-brand transition-all hover:enabled:bg-background/70 disabled:cursor-default disabled:opacity-80',
    },
    size: {
      lg: 'flex h-12 items-center justify-center px-12 text-2xl font-medium tracking-[-1.2%]',
      'icon-lg': 'flex size-12 shrink-0 items-center justify-center text-2.5 font-medium',
    },
  },
  defaultVariants: {
    variant: 'contained',
    size: 'lg',
  },
})

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ children, className, variant, size, ...props }: ButtonProps) {
  return (
    <button {...props} className={cn(buttonVariants({ variant, size }), className)}>
      {children}
    </button>
  )
}
