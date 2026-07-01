import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cva } from 'class-variance-authority'

import { cn } from '#/utils/cn'

export const inputVariants = cva('text-brand outline-none', {
  variants: {
    variant: {
      ghost: 'text-brand placeholder:text-muted',
    },
    size: {
      lg: 'text-4xl tracking-[0.5%]',
    },
  },
  defaultVariants: {
    variant: 'ghost',
    size: 'lg',
  },
})

export type InputProps = ComponentProps<'input'> & VariantProps<typeof inputVariants>

export function Input({ className, variant, size, ...props }: InputProps) {
  return <input {...props} className={cn(inputVariants({ variant, size }), className)} />
}
