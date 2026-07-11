import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'gap-1.5 uppercase flex cursor-pointer items-center justify-center',
  {
    variants: {
      variant: {
        contained:
          'bg-surface text-brand hover:enabled:bg-surface/70 transition-all disabled:cursor-default disabled:opacity-80',
      },
      size: {
        'lg': 'h-12 px-12 text-2xl font-medium flex items-center justify-center tracking-tight',
        'icon-lg':
          'size-12 text-2xl *:text-2xl font-medium flex shrink-0 items-center justify-center',
      },
    },
    defaultVariants: { variant: 'contained', size: 'lg' },
  },
)
