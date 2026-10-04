import { tv } from 'tailwind-variants'

export const dashboardResizeHandleTheme = tv({
  slots: {
    // Overlap the panel boundary without consuming layout space or painting
    // either surface. Both panels keep their own backgrounds beneath the target.
    root: 'z-10 -mx-1 w-2 bg-transparent',
    line: 'rtl:translate-x-1/2 group-focus-visible:bg-[var(--_selaras-color-indicator)]',
  },
})

export type DashboardResizeHandleThemeSlots = keyof (typeof dashboardResizeHandleTheme)['slots']
