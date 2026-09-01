import { tv } from 'tailwind-variants'

export const containerTheme = tv({
  slots: {
    base: 'w-full mx-auto px-4 sm:px-6 lg:px-8',
  },
  variants: {
    size: {
      sm: { base: 'max-w-3xl' },
      md: { base: 'max-w-5xl' },
      lg: { base: 'max-w-6xl' },
      xl: { base: 'max-w-7xl' },
      full: { base: 'max-w-none' },
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

export type ContainerThemeSlots = keyof (typeof containerTheme)['slots']
