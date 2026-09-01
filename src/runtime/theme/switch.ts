import { tv } from 'tailwind-variants'

export const switchTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-2 cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50',
    // `group` here, not `isolate` - the track (not the thumb) is the real
    // interactive element (a real <button role="switch">), so the thumb's
    // own hover/focus-visible halo has to react to the TRACK's state via
    // Tailwind's group-*: variants rather than its own :hover/
    // :focus-visible, which would never fire on a plain decorative child.
    // outline-none replaces the old focus-visible:outline box, same as
    // RadioGroup/Checkbox, now that the halo is the focus indicator. Color
    // (the checked-state fill) comes entirely from the `color` variant
    // below now, not hardcoded here - same reasoning as every other
    // themed component that exposes `color`.
    track: 'group relative inline-flex h-4.5 w-8 shrink-0 items-center rounded-[var(--ui-radius-full)] bg-[var(--ui-border)] transition-colors focus-visible:outline-none',
    // Track/thumb sized down from the original 40x24/20px to 32x18/16px - a
    // 1px inset on each side at rest (translate-x-px, thumb centered
    // vertically via the track's own items-center), traveling to 15px when
    // checked (32 track - 16 thumb - 1px inset = 15). Same halo mechanism
    // as RadioGroup/Checkbox (see their theme files for the full
    // derivation), rescaled to this thumb's own 16px size (32px halo, -8px
    // inset each side, was -10px at the old 20px size). `relative isolate`
    // still needed here even though hover/focus come from the track
    // (group-hover/group-focus-visible) - the -z-10 pseudo itself still
    // needs its own stacking context to stay scoped to the thumb, not
    // escape past it.
    thumb: 'relative isolate flex items-center justify-center size-4 translate-x-px rounded-full bg-white shadow-[var(--ui-shadow-sm)] transition-transform before:absolute before:-inset-[8px] before:-z-10 before:[transform:scale(0)] before:rounded-full before:bg-[var(--ui-border-hover)] before:opacity-35 before:transition-transform before:duration-200 before:content-[\'\'] group-hover:before:[transform:scale(1)] group-focus-visible:before:[transform:scale(1)] data-[state=checked]:translate-x-[15px]',
    // The checked/unchecked/loading glyph rendered inside the thumb -
    // muted gray by default (the thumb itself stays white regardless of
    // `color`, so an icon needs its own contrast rather than inheriting
    // currentColor from a colored parent).
    icon: 'size-2.5 text-[var(--ui-text-muted)]',
    label: 'select-none text-sm text-[var(--ui-text)]',
    description: 'block select-none text-xs text-[var(--ui-text-muted)]',
  },
  variants: {
    // Only affects the checked state - unchecked always stays the same
    // neutral border color regardless of `color`, matching how this
    // library's other "off" states (e.g. Chip's unselected variant) never
    // take on the color prop either.
    color: {
      primary: { track: 'data-[state=checked]:bg-[var(--ui-primary)]', thumb: 'data-[state=checked]:before:bg-[var(--ui-primary)]' },
      neutral: { track: 'data-[state=checked]:bg-[var(--ui-bg-inverted)]', thumb: 'data-[state=checked]:before:bg-[var(--ui-bg-inverted)]' },
      secondary: { track: 'data-[state=checked]:bg-[var(--ui-secondary)]', thumb: 'data-[state=checked]:before:bg-[var(--ui-secondary)]' },
      success: { track: 'data-[state=checked]:bg-[var(--ui-success)]', thumb: 'data-[state=checked]:before:bg-[var(--ui-success)]' },
      danger: { track: 'data-[state=checked]:bg-[var(--ui-danger)]', thumb: 'data-[state=checked]:before:bg-[var(--ui-danger)]' },
      info: { track: 'data-[state=checked]:bg-[var(--ui-info)]', thumb: 'data-[state=checked]:before:bg-[var(--ui-info)]' },
      warning: { track: 'data-[state=checked]:bg-[var(--ui-warning)]', thumb: 'data-[state=checked]:before:bg-[var(--ui-warning)]' },
    },
    // Same +4px-per-step scale RadioGroup's own `size` variant uses (its
    // item goes size-3.5/4.5/5.5 across sm/md/lg) - track/thumb/halo/travel
    // distance all re-derived from that same 1px-inset math at each size
    // (see the `thumb` slot's own comment for the base md derivation).
    size: {
      sm: { track: 'h-3.5 w-6', thumb: 'size-3 data-[state=checked]:translate-x-[11px] before:-inset-[6px]', icon: 'size-2', label: 'text-xs', description: 'text-xs' },
      md: { track: 'h-4.5 w-8', thumb: 'size-4 data-[state=checked]:translate-x-[15px] before:-inset-[8px]', icon: 'size-2.5', label: 'text-sm', description: 'text-xs' },
      lg: { track: 'h-5.5 w-10', thumb: 'size-5 data-[state=checked]:translate-x-[19px] before:-inset-[10px]', icon: 'size-3', label: 'text-base', description: 'text-sm' },
    },
    // Declared last (after color) so tailwind-merge lets its own
    // data-[state=checked] override win over color's - invalid should
    // always show danger regardless of what color was also requested, on
    // the checked track/thumb too, not just via the ring below (which
    // alone would leave an invalid-but-checked switch showing a red ring
    // around an otherwise normally-colored track).
    invalid: {
      // ring rather than an offset outline - the track has no border of
      // its own to recolor (unlike Radio/Checkbox's ring-inset), but an
      // offset outline left a visible gap between it and the pill, unlike
      // every other invalid state in this library, which sits flush.
      true: { track: 'ring-2 ring-[var(--ui-danger)] data-[state=checked]:bg-[var(--ui-danger)]', thumb: 'data-[state=checked]:before:bg-[var(--ui-danger)]' },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

export type SwitchSlots = keyof (typeof switchTheme)['slots']
