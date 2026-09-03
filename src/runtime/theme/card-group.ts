import { tv } from 'tailwind-variants'

export const cardGroupTheme = tv({
  slots: {
    root: 'grid grid-cols-1 gap-4',
  },
  variants: {
    // Matches Card's own most common comparison use (two options, a
    // before/after) as the default - `cols={3}` covers a wider spread
    // without needing an arbitrary `ui` override for the common cases.
    cols: {
      2: { root: 'sm:grid-cols-2' },
      3: { root: 'sm:grid-cols-2 lg:grid-cols-3' },
      4: { root: 'sm:grid-cols-2 lg:grid-cols-4' },
    },
  },
  defaultVariants: {
    cols: 2,
  },
})

export type CardGroupThemeSlots = keyof (typeof cardGroupTheme)['slots']
