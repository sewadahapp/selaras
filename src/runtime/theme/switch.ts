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
    track: 'group relative inline-flex h-6 w-10 shrink-0 items-center rounded-[var(--ui-radius-full)] bg-[var(--ui-border)] transition-colors focus-visible:outline-none data-[state=checked]:bg-[var(--ui-primary)]',
    // Same halo mechanism as RadioGroup/Checkbox (see their theme files
    // for the full derivation), scaled to this thumb's own 20px size (40px
    // halo, -10px inset each side). `relative isolate` still needed here
    // even though hover/focus come from the track (group-hover/
    // group-focus-visible) - the -z-10 pseudo itself still needs its own
    // stacking context to stay scoped to the thumb, not escape past it.
    thumb: 'relative isolate block size-5 translate-x-0.5 rounded-full bg-white shadow-[var(--ui-shadow-sm)] transition-transform before:absolute before:-inset-[10px] before:-z-10 before:[transform:scale(0)] before:rounded-full before:bg-[var(--ui-border-hover)] before:opacity-35 before:transition-transform before:duration-200 before:content-[\'\'] group-hover:before:[transform:scale(1)] group-focus-visible:before:[transform:scale(1)] data-[state=checked]:translate-x-[18px] data-[state=checked]:before:bg-[var(--ui-primary)]',
    label: 'select-none text-sm text-[var(--ui-text)]',
  },
  variants: {
    invalid: {
      true: { track: 'outline outline-2 outline-offset-1 outline-[var(--ui-danger)]' },
    },
  },
})

export type SwitchSlots = keyof (typeof switchTheme)['slots']
