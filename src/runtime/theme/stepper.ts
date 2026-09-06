import { tv } from 'tailwind-variants'

export const stepperTheme = tv({
  slots: {
    root: 'flex w-full items-start',
    // flex-1 (not sized to its own content) - items sit edge-to-edge with
    // no gap between them so the separator living inside the *current*
    // item's own connector (see below - Reka's StepperSeparator injects
    // that item's own context, so it can't be a root-level sibling) can
    // visually reach all the way to the next item's indicator.
    item: 'flex flex-1 flex-col items-center gap-2 text-center',
    // Anchors the indicator at the item's own true center (`justify-center`,
    // horizontal mode) - `labels` below centers within this same `item`
    // column, so both need the *same* horizontal anchor to line up. Also
    // the positioning context for the separator, which is taken out of
    // flow entirely (see its own comment) rather than laid out as a flex
    // sibling here, precisely so it can't push the indicator off-center.
    connector: 'relative flex items-center',
    trigger: 'shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-bg)] disabled:opacity-50 disabled:pointer-events-none',
    indicator: 'relative z-10 flex shrink-0 items-center justify-center rounded-full bg-[var(--ui-bg)] font-medium text-[var(--ui-text-muted)] ring-2 ring-[var(--ui-border)] transition-colors',
    icon: 'shrink-0',
    labels: 'flex flex-col',
    title: 'text-sm font-medium text-[var(--ui-text)]',
    description: 'text-xs text-[var(--ui-text-muted)]',
    // bg-border by default, switching to the color's own solid shade via
    // data-[state=completed] (set by Reka from the *preceding* item's own
    // state) - that's what makes the line "fill in" as steps complete.
    separator: 'absolute bg-[var(--ui-border)] transition-colors',
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'flex-row',
        connector: 'w-full justify-center',
        // Every item is an equal-width flex-1 column, so a line starting
        // at *this* item's own center (left-1/2, matching connector's own
        // justify-center anchor above) and spanning one more full item-
        // width (w-full, relative to this same connector) lands exactly
        // on the *next* item's center - reaching a correctly-centered
        // indicator there regardless of either item's own label width.
        separator: 'left-1/2 top-1/2 h-0.5 w-full -translate-y-1/2',
      },
      vertical: {
        // No items-start here (default align-items: stretch) - connector
        // and labels are the item's only two children, and connector
        // needs to stretch to the item's full row height for the
        // separator below to have real height to grow into. labels opts
        // back out of that stretch itself (self-start below).
        root: 'flex-col',
        item: 'w-full flex-row gap-3 text-start',
        connector: 'w-auto flex-col',
        // Extra bottom padding gives the connecting line a decent
        // minimum length even for a single short line of title text.
        labels: 'shrink-0 self-start pb-6',
        // Items can differ in height (description length varies), so
        // horizontal's own "reaches exactly the next center" trick
        // doesn't transfer - a real in-flow flex-1 line stretching to
        // fill whatever height the (stretched) connector column has is
        // the more robust fit here.
        separator: 'relative w-0.5 min-h-6 flex-1',
      },
    },
    size: {
      sm: { indicator: 'size-6 text-xs', title: 'text-xs', description: 'text-xs' },
      md: { indicator: 'size-8 text-sm', title: 'text-sm', description: 'text-xs' },
      lg: { indicator: 'size-10 text-base', title: 'text-base', description: 'text-sm' },
    },
    color: {
      primary: {
        indicator: 'data-[state=active]:ring-[var(--ui-primary)] data-[state=active]:text-[var(--ui-primary)] data-[state=completed]:bg-[var(--ui-primary)] data-[state=completed]:ring-[var(--ui-primary)] data-[state=completed]:text-[var(--ui-primary-foreground)]',
        separator: 'data-[state=completed]:bg-[var(--ui-primary)]',
      },
      neutral: {
        indicator: 'data-[state=active]:ring-[var(--ui-bg-inverted)] data-[state=active]:text-[var(--ui-text)] data-[state=completed]:bg-[var(--ui-bg-inverted)] data-[state=completed]:ring-[var(--ui-bg-inverted)] data-[state=completed]:text-[var(--ui-text-inverted)]',
        separator: 'data-[state=completed]:bg-[var(--ui-bg-inverted)]',
      },
      secondary: {
        indicator: 'data-[state=active]:ring-[var(--ui-secondary)] data-[state=active]:text-[var(--ui-secondary)] data-[state=completed]:bg-[var(--ui-secondary)] data-[state=completed]:ring-[var(--ui-secondary)] data-[state=completed]:text-[var(--ui-secondary-foreground)]',
        separator: 'data-[state=completed]:bg-[var(--ui-secondary)]',
      },
      success: {
        indicator: 'data-[state=active]:ring-[var(--ui-success)] data-[state=active]:text-[var(--ui-success)] data-[state=completed]:bg-[var(--ui-success)] data-[state=completed]:ring-[var(--ui-success)] data-[state=completed]:text-[var(--ui-success-foreground)]',
        separator: 'data-[state=completed]:bg-[var(--ui-success)]',
      },
      danger: {
        indicator: 'data-[state=active]:ring-[var(--ui-danger)] data-[state=active]:text-[var(--ui-danger)] data-[state=completed]:bg-[var(--ui-danger)] data-[state=completed]:ring-[var(--ui-danger)] data-[state=completed]:text-[var(--ui-danger-foreground)]',
        separator: 'data-[state=completed]:bg-[var(--ui-danger)]',
      },
      info: {
        indicator: 'data-[state=active]:ring-[var(--ui-info)] data-[state=active]:text-[var(--ui-info)] data-[state=completed]:bg-[var(--ui-info)] data-[state=completed]:ring-[var(--ui-info)] data-[state=completed]:text-[var(--ui-info-foreground)]',
        separator: 'data-[state=completed]:bg-[var(--ui-info)]',
      },
      warning: {
        indicator: 'data-[state=active]:ring-[var(--ui-warning)] data-[state=active]:text-[var(--ui-warning)] data-[state=completed]:bg-[var(--ui-warning)] data-[state=completed]:ring-[var(--ui-warning)] data-[state=completed]:text-[var(--ui-warning-foreground)]',
        separator: 'data-[state=completed]:bg-[var(--ui-warning)]',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
    color: 'primary',
  },
})

export type StepperThemeSlots = keyof (typeof stepperTheme)['slots']
