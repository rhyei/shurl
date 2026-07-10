import type { VariantProps } from 'class-variance-authority'

import { Button as ButtonPrimitive } from '@base-ui/react'
import { cva } from 'class-variance-authority'

import { cn } from '#/utils/cn'

export const buttonVariants = cva('gap-1.5 flex cursor-pointer items-center justify-center', {
  variants: {
    variant: {
      contained:
        'bg-surface text-brand hover:enabled:bg-surface/70 transition-all disabled:cursor-default disabled:opacity-80',
    },
    size: {
      lg: 'h-12 px-12 text-2xl font-medium flex items-center justify-center tracking-[-1.2%]',
      'icon-lg':
        'size-12 text-2xl *:text-2xl font-medium flex shrink-0 items-center justify-center',
    },
  },
  defaultVariants: {
    variant: 'contained',
    size: 'lg',
  },
})

export type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

export function Button({ children, className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive {...props} className={cn(buttonVariants({ variant, size }), className)}>
      {children}
    </ButtonPrimitive>
  )
}
