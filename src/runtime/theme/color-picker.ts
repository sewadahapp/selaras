import { tv } from 'tailwind-variants'

export const colorPickerTheme = tv({
  slots: {
    // Same chrome as Select's own trigger (select.ts) - both are a form
    // field that opens a popover, so they share the exact ring/hover/
    // focus/disabled treatment rather than reinventing it here.
    trigger: 'inline-flex w-full min-h-10 items-center gap-2 rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] px-3 py-1.5 text-sm ring-1 ring-inset ring-[var(--ui-border)] outline-none transition-[color,background-color,box-shadow] not-focus:not-data-[state=open]:hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus:ring-2 data-[state=open]:ring-2 disabled:opacity-50 disabled:pointer-events-none',
    // Painted via ColorSwatch's own exposed --reka-color-swatch-color
    // custom property - ColorSwatch.js applies no background of its own,
    // only exposes that var, so every consumer of it (this trigger swatch
    // and each preset item's own swatch below) pulls color from the same
    // arbitrary-value bg-[var(...)] utility.
    triggerSwatch: 'size-5 shrink-0 rounded-[var(--ui-radius-sm)] bg-[var(--reka-color-swatch-color)] ring-1 ring-inset ring-black/10',
    triggerValue: 'flex-1 truncate text-start font-mono text-[var(--ui-text)]',
    content: 'z-50 w-64 space-y-3 rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] p-3 shadow-[var(--ui-shadow-md)] ring-1 ring-[var(--ui-border)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    // The `mobileModal` path's own content wrapper - none of `content`'s
    // own popover chrome (width/background/shadow/ring/rounded/animate)
    // applies here, since Modal's own card already provides that surface;
    // this only needs this picker's own internal spacing/padding, same
    // reasoning as Select's own mobileContent (select.ts).
    mobileContent: 'w-full space-y-3 p-4',
    area: 'relative h-40 w-full overflow-hidden rounded-[var(--ui-radius-sm)] cursor-crosshair',
    // Shared by the area thumb and both slider thumbs below - all three
    // are the same plain white ring-bordered circle sitting on top of a
    // color surface Reka itself paints (the area's own gradient, each
    // slider track's own gradient) - a colored ring here would fight
    // that surface instead of marking a position on it, the same reason
    // Slider.vue's own thumb stays neutral against its colored range.
    thumb: 'block size-4 shrink-0 rounded-full border-2 border-white shadow-[var(--ui-shadow-sm)] ring-1 ring-[var(--ui-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-primary)]',
    // ColorSliderRoot itself (bound onto directly, no dedicated slot of
    // its own since nothing else needs to reach it) - Reka's own default
    // `as` for it is a bare inline `span` (confirmed in Slider/SliderRoot.js,
    // which this wraps), so it needs `block` before `w-full` on the track
    // below means anything (`width` doesn't apply to non-replaced inline
    // boxes at all, not just "shrinks to content" - a span child of this
    // stayed effectively zero-width without it).
    sliderRoot: 'block w-full',
    // Shared by the hue and alpha sliders - both are a plain rounded-full
    // track whose gradient comes from Reka's own injected inline style
    // (ColorSliderTrack.js), not this class. Same inline-`span`-by-default
    // reasoning as sliderRoot above applies here too - `block` first.
    track: 'relative block h-3 w-full cursor-pointer rounded-full ring-1 ring-inset ring-black/10',
    field: 'w-full rounded-[var(--ui-radius-sm)] bg-[var(--ui-bg)] px-2 py-1.5 text-sm font-mono text-[var(--ui-text)] ring-1 ring-inset ring-[var(--ui-border)] outline-none transition-[color,background-color,box-shadow] not-focus:hover:ring-[var(--ui-border-hover)] focus:ring-2 focus:ring-[var(--ui-primary)]',
    swatchList: 'flex flex-wrap gap-1.5',
    swatch: 'relative size-6 shrink-0 rounded-[var(--ui-radius-sm)] ring-1 ring-inset ring-black/10 cursor-pointer data-[highlighted]:ring-2 data-[highlighted]:ring-[var(--ui-border-hover)] data-[state=checked]:ring-2 data-[state=checked]:ring-[var(--ui-primary)] data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
    // The preset item's own color fill - same --reka-color-swatch-color
    // var as triggerSwatch, sized to fill its parent `swatch` item
    // (rounded-[inherit] so it doesn't poke past that item's own corners).
    swatchFill: 'absolute inset-0 size-full rounded-[inherit] bg-[var(--reka-color-swatch-color)]',
    // Centered over the swatch (relative) it belongs to - only rendered
    // once selected (Reka's own ListboxItemIndicator gates that).
    swatchIndicator: 'absolute inset-0 flex items-center justify-center text-white mix-blend-difference',
  },
  variants: {
    // Same height steps as Select's own trigger (select.ts) - the two
    // are the same "form field that opens a popover" shape.
    size: {
      sm: { trigger: 'min-h-8 text-sm' },
      md: { trigger: 'min-h-10' },
      lg: { trigger: 'min-h-11 text-base' },
    },
    // Focus-ring color only, same scope as Select's own `color` variant -
    // the resting ring stays --ui-border regardless.
    color: {
      primary: { trigger: 'focus:ring-[var(--ui-primary)] data-[state=open]:ring-[var(--ui-primary)]' },
      neutral: { trigger: 'focus:ring-[var(--ui-bg-inverted)] data-[state=open]:ring-[var(--ui-bg-inverted)]' },
      secondary: { trigger: 'focus:ring-[var(--ui-secondary)] data-[state=open]:ring-[var(--ui-secondary)]' },
      success: { trigger: 'focus:ring-[var(--ui-success)] data-[state=open]:ring-[var(--ui-success)]' },
      danger: { trigger: 'focus:ring-[var(--ui-danger)] data-[state=open]:ring-[var(--ui-danger)]' },
      info: { trigger: 'focus:ring-[var(--ui-info)] data-[state=open]:ring-[var(--ui-info)]' },
      warning: { trigger: 'focus:ring-[var(--ui-warning)] data-[state=open]:ring-[var(--ui-warning)]' },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

export type ColorPickerThemeSlots = keyof (typeof colorPickerTheme)['slots']
