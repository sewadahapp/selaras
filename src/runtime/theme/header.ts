import { tv } from 'tailwind-variants'

export const headerTheme = tv({
  slots: {
    root: 'sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--ui-border)] bg-[var(--ui-bg)] px-4 sm:px-6',
    left: 'flex min-w-0 items-center gap-2',
    right: 'flex shrink-0 items-center gap-2',
  },
})

export type HeaderSlots = keyof (typeof headerTheme)['slots']
