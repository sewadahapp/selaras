import { tv } from 'tailwind-variants'

export const datePickerTheme = tv({
  slots: {
    root: 'relative inline-block',
    // Same ring/bg/radius/hover/focus-within language as Input's own `base`
    // (theme/input.ts) - this is an Input-look box wrapping real interactive
    // children (segments + trigger button) rather than a single <input>, so
    // the focus ring keys off :focus-within instead of :focus.
    // not-focus-within: on the hover ring - see input-number.ts's own root
    // slot for why (same fix, same reasoning: hovering while focused is
    // unavoidable here, and would otherwise let the plain gray hover ring
    // beat the primary focus-within ring).
    field: 'inline-flex w-full items-center gap-1 rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] ring-1 ring-inset ring-[var(--ui-border)] transition-[color,background-color,box-shadow] not-focus-within:hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus-within:ring-2 focus-within:ring-[var(--ui-primary)] has-[[data-disabled]]:opacity-50 has-[[data-disabled]]:pointer-events-none',
    // rounded-sm + tabular-nums keeps digit width stable as a segment's
    // value changes; the segment itself is the contenteditable element
    // Reka renders, so focus state is real :focus, not a data-attribute.
    segment: 'rounded-[var(--ui-radius-sm)] px-0.5 text-[var(--ui-text)] tabular-nums outline-none focus:bg-[var(--ui-primary)]/15 data-[reka-date-field-segment=literal]:px-0 data-[reka-date-field-segment=literal]:text-[var(--ui-text-muted)]',
    // Between the two segment groups in range mode - a plain en dash, not an
    // arrow glyph, so there's nothing directional to mirror under RTL.
    separator: 'px-0.5 text-[var(--ui-text-muted)]',
    // Copied from theme/dropdown.ts's `content` - the more complete of this
    // library's two floating-panel precedents (directional slide-in, not
    // just fade/zoom).
    content: 'z-[var(--ui-z-dropdown)] rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] p-3 shadow-[var(--ui-shadow-md)] ring-1 ring-[var(--ui-border)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
    header: 'mb-2 flex items-center justify-between gap-2',
    heading: 'text-sm font-medium text-[var(--ui-text)]',
    // Wraps one <table> per visible month (numberOfMonths>1, e.g. range
    // mode's default of 2) - without it, multiple month tables just stack
    // vertically (block-level default), not side by side.
    grids: 'flex flex-col gap-4 sm:flex-row',
    grid: 'w-full border-collapse',
    gridHead: '',
    headCell: 'size-8 text-xs font-medium text-[var(--ui-text-muted)]',
    // The <td> wrapper - just spacing, not the day's own look (that's the
    // nested Button inside it, styled directly in DatePicker.vue via a
    // plain :ui override string, same as Pagination's page buttons - no
    // separate theme slot for it, since Button already owns variant/size).
    cell: 'p-0.5 text-center',
    // Month/year drill-down grids (view mode) - a fixed 3-column layout for
    // both the 12-month and 12-year grids, reusing the same Button
    // composition pattern as day cells.
    viewGrid: 'grid grid-cols-3 gap-1',
    // Hour/minute granularity only - sits below the day grid, separated by
    // a divider so it doesn't read as part of the grid itself.
    timeSection: 'mt-3 flex items-center justify-center gap-1.5 border-t border-[var(--ui-border)] pt-3',
    arrow: 'fill-[var(--ui-bg)] stroke-[var(--ui-border)] stroke-1',
  },
  variants: {
    size: {
      sm: { field: 'h-8 px-2.5 text-sm' },
      md: { field: 'h-10 px-3 text-sm' },
      lg: { field: 'h-11 px-3.5 text-base' },
    },
    invalid: {
      true: { field: 'ring-[var(--ui-danger)] hover:ring-[var(--ui-danger)] focus-within:ring-[var(--ui-danger)]' },
    },
    // Range mode's day cells butt up against each other with no horizontal
    // gap, so a highlighted run of days reads as one continuous connected
    // bar instead of separate dashes - single-date mode keeps its own
    // centered p-0.5 spacing untouched.
    range: {
      true: { cell: 'p-0 py-0.5' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type DatePickerThemeSlots = keyof (typeof datePickerTheme)['slots']
