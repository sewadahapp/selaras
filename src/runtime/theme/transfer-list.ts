import { tv } from 'tailwind-variants'

export const transferListTheme = tv({
  slots: {
    root: 'flex min-w-0 gap-3',
    panel: 'flex min-w-0 flex-1 flex-col gap-2',
    header: 'flex items-center justify-between gap-2 text-sm font-medium text-[var(--selaras-resolved-text-default)]',
    count: 'text-xs font-normal text-[var(--selaras-resolved-text-muted)]',
    listbox: 'flex-1',
    actions: 'flex shrink-0 items-center justify-center gap-2',
    action: '',
    announcement: 'sr-only',
  },
  variants: {
    layout: {
      auto: { root: 'flex-col sm:flex-row', actions: 'flex-row sm:flex-col' },
      horizontal: { root: 'flex-row', actions: 'flex-col' },
      vertical: { root: 'flex-col', actions: 'flex-row' },
    },
  },
  defaultVariants: { layout: 'auto' },
})

export type TransferListThemeSlots = keyof (typeof transferListTheme)['slots']
