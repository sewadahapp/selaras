import { tv } from 'tailwind-variants'

export const dashboardGroupTheme = tv({
  slots: {
    // Same class works for both the desktop SplitterGroup and the mobile
    // plain-div fallback - a horizontal flex row either way, just without
    // Splitter's own inline flex-basis styling driving the split on mobile.
    root: 'flex h-full w-full overflow-hidden',
  },
})

export type DashboardGroupThemeSlots = keyof (typeof dashboardGroupTheme)['slots']
