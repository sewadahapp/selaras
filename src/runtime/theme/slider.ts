import { tv } from 'tailwind-variants'

export const sliderTheme = tv({
  slots: {
    root: 'relative flex touch-none select-none items-center data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
    track: 'relative grow rounded-full bg-[var(--ui-border)]',
    // Reka's own SliderRange sets left/right (horizontal) or top/bottom
    // (vertical) itself via inline style, to size the *main* axis - the
    // *cross* axis (this slot's own height for horizontal, width for
    // vertical) is left entirely up to the theme, and an absolutely
    // positioned element with no top/bottom of its own collapses to 0
    // height. inset-y-0/inset-x-0 below (in the orientation variant)
    // supply that missing cross-axis size.
    range: 'absolute rounded-full',
    thumb: 'block shrink-0 rounded-full bg-[var(--ui-bg)] shadow-[var(--ui-shadow-sm)] ring-2 transition-shadow focus-visible:outline-none focus-visible:ring-4',
    // Own addition - Reka's Slider has no tick/mark concept of its own.
    // Positioned via an inline style (percent along the track), not a
    // variant - see Slider.vue's own `ticks` computed.
    tick: 'absolute size-1 -translate-x-1/2 rounded-full bg-[var(--ui-border-hover)]',
    // Own addition - flanking content (an icon, an emoji, a unit label)
    // either side of the track. Plain flex boxes, no Reka equivalent.
    start: 'flex shrink-0 items-center justify-center text-[var(--ui-text-muted)]',
    end: 'flex shrink-0 items-center justify-center text-[var(--ui-text-muted)]',
  },
  variants: {
    size: {
      sm: { track: 'h-1', thumb: 'size-3.5', tick: 'top-1/2 -translate-y-1/2' },
      md: { track: 'h-1.5', thumb: 'size-4', tick: 'top-1/2 -translate-y-1/2' },
      lg: { track: 'h-2', thumb: 'size-5', tick: 'top-1/2 -translate-y-1/2' },
    },
    color: {
      primary: { range: 'bg-[var(--ui-primary)]', thumb: 'ring-[var(--ui-primary)]' },
      neutral: { range: 'bg-[var(--ui-bg-inverted)]', thumb: 'ring-[var(--ui-bg-inverted)]' },
      secondary: { range: 'bg-[var(--ui-secondary)]', thumb: 'ring-[var(--ui-secondary)]' },
      success: { range: 'bg-[var(--ui-success)]', thumb: 'ring-[var(--ui-success)]' },
      danger: { range: 'bg-[var(--ui-danger)]', thumb: 'ring-[var(--ui-danger)]' },
      info: { range: 'bg-[var(--ui-info)]', thumb: 'ring-[var(--ui-info)]' },
      warning: { range: 'bg-[var(--ui-warning)]', thumb: 'ring-[var(--ui-warning)]' },
    },
    // Vertical needs a real, non-zero height to size against - unlike
    // horizontal, which sizes off its own intrinsic full width.
    orientation: {
      horizontal: { root: 'w-full', range: 'inset-y-0' },
      vertical: { root: 'h-44 flex-col', range: 'inset-x-0', tick: 'inset-x-1/2 top-auto translate-x-0 translate-y-1/2' },
    },
    // circle (default): the existing round thumb, sized entirely by
    // `size` above. bar: a thin rounded rectangle instead - long across
    // the track's own cross axis, narrow along its main axis - sized via
    // the compoundVariants below (it needs both `size` *and*
    // `orientation` to pick the right long/short axis, so a flat
    // per-size class here isn't enough on its own).
    thumbVariant: {
      circle: { thumb: 'rounded-full' },
      bar: { thumb: 'rounded-sm' },
    },
  },
  compoundVariants: [
    { orientation: 'vertical', size: 'sm', class: { track: 'h-full w-1' } },
    { orientation: 'vertical', size: 'md', class: { track: 'h-full w-1.5' } },
    { orientation: 'vertical', size: 'lg', class: { track: 'h-full w-2' } },
    { thumbVariant: 'bar', orientation: 'horizontal', size: 'sm', class: { thumb: 'h-4 w-1' } },
    { thumbVariant: 'bar', orientation: 'horizontal', size: 'md', class: { thumb: 'h-5 w-1.5' } },
    { thumbVariant: 'bar', orientation: 'horizontal', size: 'lg', class: { thumb: 'h-6 w-2' } },
    { thumbVariant: 'bar', orientation: 'vertical', size: 'sm', class: { thumb: 'h-1 w-4' } },
    { thumbVariant: 'bar', orientation: 'vertical', size: 'md', class: { thumb: 'h-1.5 w-5' } },
    { thumbVariant: 'bar', orientation: 'vertical', size: 'lg', class: { thumb: 'h-2 w-6' } },
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    orientation: 'horizontal',
    thumbVariant: 'circle',
  },
})

export type SliderThemeSlots = keyof (typeof sliderTheme)['slots']
