import { tv } from 'tailwind-variants'

export const splitterPanelTheme = tv({
  slots: {
    // Deliberately no visual styling (border/background/padding) - a
    // panel's own look depends entirely on what it's used for (a sidebar
    // looks nothing like a code viewer), left to the consumer.
    root: 'overflow-hidden',
  },
})

export type SplitterPanelThemeSlots = keyof (typeof splitterPanelTheme)['slots']
