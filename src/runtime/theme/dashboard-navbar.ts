import { tv } from 'tailwind-variants'

export const dashboardNavbarTheme = tv({
  slots: {
    root: 'flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[var(--selaras-resolved-border-default)] bg-[var(--selaras-resolved-surface-default)] px-4',
    left: 'flex min-w-0 items-center gap-2',
    title: 'truncate font-medium text-[var(--selaras-resolved-text-default)]',
    right: 'flex shrink-0 items-center gap-2',
  },
})

export type DashboardNavbarThemeSlots = keyof (typeof dashboardNavbarTheme)['slots']
