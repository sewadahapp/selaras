import { tv } from 'tailwind-variants'

export const splitterTheme = tv({
  slots: {
    root: 'flex h-full w-full overflow-hidden',
  },
  variants: {
    direction: {
      horizontal: { root: 'flex-row' },
      vertical: { root: 'flex-col' },
    },
  },
  defaultVariants: {
    direction: 'horizontal',
  },
})

export type SplitterThemeSlots = keyof (typeof splitterTheme)['slots']
