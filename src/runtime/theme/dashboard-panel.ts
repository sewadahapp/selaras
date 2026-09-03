import { tv } from 'tailwind-variants'

export const dashboardPanelTheme = tv({
  slots: {
    root: 'flex min-w-0 flex-1 flex-col overflow-hidden',
  },
})

export type DashboardPanelThemeSlots = keyof (typeof dashboardPanelTheme)['slots']
