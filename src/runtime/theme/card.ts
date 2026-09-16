import { tv } from 'tailwind-variants'

export const cardTheme = tv({
  slots: {
    root: 'rounded-[var(--selaras-resolved-radius-md)] overflow-hidden',
    header: 'p-4 border-b border-[var(--selaras-resolved-border-default)]',
    body: 'p-4',
    footer: 'p-4 border-t border-[var(--selaras-resolved-border-default)]',
  },
  variants: {
    variant: {
      outline: { root: 'bg-[var(--selaras-resolved-surface-default)] ring-1 ring-[var(--selaras-resolved-border-default)]' },
      solid: { root: 'bg-[var(--selaras-resolved-surface-elevated)] shadow-[var(--selaras-resolved-shadow-md)]' },
      soft: { root: 'bg-[var(--selaras-resolved-surface-elevated)]' },
      // Same elevated background as soft, plus outline's own border - a
      // middle ground between the two rather than a combination of their
      // literal classes, so it stays its own single, ordinary variant.
      subtle: { root: 'bg-[var(--selaras-resolved-surface-elevated)] ring-1 ring-[var(--selaras-resolved-border-default)]' },
    },
  },
  defaultVariants: {
    variant: 'outline',
  },
})

export type CardThemeSlots = keyof (typeof cardTheme)['slots']
