import { tv } from 'tailwind-variants'

export const dashboardResizeHandleTheme = tv({
  slots: {
    // SplitterResizeHandle's own hit area is deliberately wider than its
    // visible line (a comfortable grab target, invisible padding on
    // either side) - harmless when both adjacent panels share one
    // background, but once DashboardSidebar's own root reads as
    // --ui-bg-elevated (a step apart from DashboardPanel's own plain
    // --ui-bg), that "invisible" padding stops being invisible: it reads
    // as a sliver of the wrong background bleeding through right at the
    // sidebar's own edge. A background split exactly down the middle -
    // matching each side's real background - makes the hit area blend
    // into whichever panel it happens to be sitting over instead of
    // showing through as its own separate strip.
    root: 'bg-[linear-gradient(to_right,var(--ui-bg-elevated)_50%,var(--ui-bg)_50%)]',
  },
})

export type DashboardResizeHandleThemeSlots = keyof (typeof dashboardResizeHandleTheme)['slots']
