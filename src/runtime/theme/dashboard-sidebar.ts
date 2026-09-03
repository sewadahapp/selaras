import { tv } from 'tailwind-variants'

export const dashboardSidebarTheme = tv({
  slots: {
    // flex flex-col so header/body/footer stack correctly regardless of
    // which root element renders (SplitterPanel on desktop, Drawer's own
    // content area on mobile) - both need the same internal layout.
    root: 'flex h-full flex-col overflow-hidden border-e border-[var(--ui-border)] bg-[var(--ui-bg)]',
    header: 'shrink-0 border-b border-[var(--ui-border)] p-4',
    body: 'p-2',
    footer: 'shrink-0 border-t border-[var(--ui-border)] p-4',
  },
})

export type DashboardSidebarThemeSlots = keyof (typeof dashboardSidebarTheme)['slots']
