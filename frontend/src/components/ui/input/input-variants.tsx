import { cva } from 'class-variance-authority'

export const inputVariants = cva('text-brand outline-none', {
  variants: {
    variant: {
      ghost: `relative text-brand placeholder:text-muted bg-transparent outline-transparent outline-none bg-transparent outline-none
      bg-transparent
    `,
    },
    size: {
      lg: 'text-4xl tracking-tight pb-1',
    },
  },
  defaultVariants: {
    variant: 'ghost',
    size: 'lg',
  },
})
