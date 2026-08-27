import { tv } from 'tailwind-variants'

export const paginationTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-1',
    list: 'flex items-center gap-1',
    // Sized per-variant to match Button's own square icon-button dimensions
    // (w-8/w-10/w-11) so the ellipsis lines up with the surrounding
    // page-number buttons instead of collapsing to its own text size.
    ellipsis: 'inline-flex items-center justify-center text-[var(--ui-text-muted)]',
  },
  variants: {
    size: {
      sm: { root: 'gap-1', list: 'gap-1', ellipsis: 'size-8 text-sm' },
      md: { root: 'gap-1.5', list: 'gap-1.5', ellipsis: 'size-10 text-sm' },
      lg: { root: 'gap-2', list: 'gap-2', ellipsis: 'size-11 text-base' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type PaginationSlots = keyof (typeof paginationTheme)['slots']
