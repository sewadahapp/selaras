import { tv } from 'tailwind-variants'

export const dashboardNavbarTheme = tv({
  slots: {
    root: 'flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[var(--ui-border)] bg-[var(--ui-bg)] px-4',
    left: 'flex min-w-0 items-center gap-2',
    title: 'truncate font-medium text-[var(--ui-text)]',
    right: 'flex shrink-0 items-center gap-2',
  },
})

export type DashboardNavbarThemeSlots = keyof (typeof dashboardNavbarTheme)['slots']
