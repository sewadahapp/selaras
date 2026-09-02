import { tv } from 'tailwind-variants'

export const sliderTheme = tv({
  slots: {
    root: 'relative flex touch-none select-none items-center data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
    track: 'relative grow rounded-full bg-[var(--ui-border)]',
    range: 'absolute rounded-full',
    thumb: 'block shrink-0 rounded-full bg-[var(--ui-bg)] shadow-[var(--ui-shadow-sm)] ring-2 transition-shadow focus-visible:outline-none focus-visible:ring-4',
    // Own addition - Reka's Slider has no tick/mark concept of its own.
    // Positioned via an inline style (percent along the track), not a
    // variant - see Slider.vue's own `ticks` computed.
    tick: 'absolute size-1 -translate-x-1/2 rounded-full bg-[var(--ui-border-hover)]',
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
      horizontal: { root: 'w-full' },
      vertical: { root: 'h-44 flex-col', tick: 'inset-x-1/2 top-auto translate-x-0 translate-y-1/2' },
    },
  },
  compoundVariants: [
    { orientation: 'vertical', size: 'sm', class: { track: 'h-full w-1' } },
    { orientation: 'vertical', size: 'md', class: { track: 'h-full w-1.5' } },
    { orientation: 'vertical', size: 'lg', class: { track: 'h-full w-2' } },
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    orientation: 'horizontal',
  },
})

export type SliderThemeSlots = keyof (typeof sliderTheme)['slots']
