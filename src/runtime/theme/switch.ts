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
    // RadioGroup/Checkbox, now that the halo is the focus indicator.
    track: 'group relative inline-flex h-4.5 w-8 shrink-0 items-center rounded-[var(--ui-radius-full)] bg-[var(--ui-border)] transition-colors focus-visible:outline-none data-[state=checked]:bg-[var(--ui-primary)]',
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
    thumb: 'relative isolate block size-4 translate-x-px rounded-full bg-white shadow-[var(--ui-shadow-sm)] transition-transform before:absolute before:-inset-[8px] before:-z-10 before:[transform:scale(0)] before:rounded-full before:bg-[var(--ui-border-hover)] before:opacity-35 before:transition-transform before:duration-200 before:content-[\'\'] group-hover:before:[transform:scale(1)] group-focus-visible:before:[transform:scale(1)] data-[state=checked]:translate-x-[15px] data-[state=checked]:before:bg-[var(--ui-primary)]',
    label: 'select-none text-sm text-[var(--ui-text)]',
  },
  variants: {
    // ring rather than an offset outline - the track has no border of its
    // own to recolor (unlike Radio/Checkbox's ring-inset), but an offset
    // outline left a visible gap between it and the pill, unlike every
    // other invalid state in this library, which sits flush.
    invalid: {
      true: { track: 'ring-2 ring-[var(--ui-danger)]' },
    },
  },
})

export type SwitchSlots = keyof (typeof switchTheme)['slots']
