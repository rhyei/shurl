import { cva } from 'class-variance-authority'

export const inputVariants = cva('text-brand outline-none', {
  variants: {
    variant: { ghost: 'text-brand placeholder:text-muted bg-transparent outline-none!' },
    size: { lg: 'text-4xl tracking-tight' },
  },
  defaultVariants: { variant: 'ghost', size: 'lg' },
})
