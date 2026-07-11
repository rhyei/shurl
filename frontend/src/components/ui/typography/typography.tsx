import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '#/utils/cn'

import { typographyVariants } from './typography-variants'

export type TypographyTag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type TypographyProps<Tag extends TypographyTag = 'span'> = {
  tag?: Tag
  variant?: 'caption'
  className?: string
} & Omit<ComponentPropsWithoutRef<Tag>, 'tag' | 'variant'>

export function Typography<Tag extends TypographyTag = 'span'>({
  className,
  tag,
  variant,
  ...props
}: TypographyProps<Tag>) {
  const Component = tag ?? 'span'

  return <Component className={cn(typographyVariants({ variant }), className)} {...props} />
}
