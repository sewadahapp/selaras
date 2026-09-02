import { tv } from 'tailwind-variants'

export const cardTheme = tv({
  slots: {
    root: 'rounded-[var(--ui-radius-md)] overflow-hidden',
    header: 'p-4 border-b border-[var(--ui-border)]',
    body: 'p-4',
    footer: 'p-4 border-t border-[var(--ui-border)]',
  },
  variants: {
    variant: {
      outline: { root: 'bg-[var(--ui-bg)] ring-1 ring-[var(--ui-border)]' },
      solid: { root: 'bg-[var(--ui-bg-elevated)] shadow-[var(--ui-shadow-md)]' },
      soft: { root: 'bg-[var(--ui-bg-elevated)]' },
      // Same elevated background as soft, plus outline's own border - a
      // middle ground between the two rather than a combination of their
      // literal classes, so it stays its own single, ordinary variant.
      subtle: { root: 'bg-[var(--ui-bg-elevated)] ring-1 ring-[var(--ui-border)]' },
    },
  },
  defaultVariants: {
    variant: 'outline',
  },
})

export type CardThemeSlots = keyof (typeof cardTheme)['slots']
