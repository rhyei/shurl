import type { VariantProps } from 'class-variance-authority'

import { Input as InputPrimitive } from '@base-ui/react'

import { cn } from '#/utils/cn'

import { inputVariants } from './input-variants'

export type InputProps = InputPrimitive.Props & VariantProps<typeof inputVariants>

export function Input({ className, variant, size, ...props }: InputProps) {
  return <InputPrimitive {...props} className={cn(inputVariants({ variant, size }), className)} />
}
