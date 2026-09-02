import { tv } from 'tailwind-variants'

export const separatorTheme = tv({
  slots: {
    root: 'flex shrink-0 items-center',
    // A zero-size box with a themed border on the relevant side, not a
    // background fill - a background-color only ever looks solid
    // regardless of variant, and dashed/dotted need a real border-style
    // to render at all. flex-1 - with no label this is the only child,
    // so it alone fills the root's full length and looks identical to a
    // plain bar; with a label, a second one of these renders after it
    // (see Separator.vue), splitting the available space evenly on both
    // sides of the text.
    line: 'shrink-0 border-[var(--ui-border)]',
    // Always muted, independent of `color` - a colored line with
    // matching bright label text reads as garish rather than
    // informative; the label stays legible/neutral regardless of how
    // much the line itself is emphasized.
    label: 'shrink-0 px-2 text-xs text-[var(--ui-text-muted)] whitespace-nowrap',
  },
  variants: {
    orientation: {
      horizontal: { root: 'w-full flex-row', line: 'h-0 flex-1 border-t' },
      vertical: { root: 'h-full flex-col', line: 'w-0 flex-1 border-l' },
    },
    variant: {
      solid: { line: 'border-solid' },
      dashed: { line: 'border-dashed' },
      dotted: { line: 'border-dotted' },
      // CSS's own double border-style needs real width to show two
      // distinct lines at all - at the 1px default the two lines and
      // the gap between them have no room to render separately, so this
      // also widens the border (see the compoundVariants below, one per
      // orientation since the thickened side differs).
      double: { line: 'border-double' },
    },
    // Unlike Input/PinInput's own `color` (focus-ring only), the line is
    // always visible with no interactive state to gate a color reveal
    // behind - it just tints directly. `neutral` here means the same
    // subtle --ui-border this component always used, not the bold
    // --ui-bg-inverted "neutral" means elsewhere (Checkbox, Slider, ...) -
    // a divider's own default has to stay subtle, matching precedent for
    // "neutral" carrying whatever's contextually right per component
    // (Badge's own soft variant does the same with --ui-bg-elevated).
    color: {
      neutral: { line: 'border-[var(--ui-border)]' },
      primary: { line: 'border-[var(--ui-primary)]' },
      secondary: { line: 'border-[var(--ui-secondary)]' },
      success: { line: 'border-[var(--ui-success)]' },
      danger: { line: 'border-[var(--ui-danger)]' },
      info: { line: 'border-[var(--ui-info)]' },
      warning: { line: 'border-[var(--ui-warning)]' },
    },
  },
  compoundVariants: [
    { variant: 'double', orientation: 'horizontal', class: { line: 'border-t-[3px]' } },
    { variant: 'double', orientation: 'vertical', class: { line: 'border-l-[3px]' } },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
    color: 'neutral',
  },
})

export type SeparatorThemeSlots = keyof (typeof separatorTheme)['slots']
