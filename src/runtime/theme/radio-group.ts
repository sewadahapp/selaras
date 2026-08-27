import { tv } from 'tailwind-variants'

export const radioGroupTheme = tv({
  slots: {
    root: 'flex flex-col gap-2',
    itemWrapper: 'inline-flex items-center gap-2 cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50',
    // relative + the before:* utilities are a radial halo - a circle a
    // bit larger than the dot itself, invisible at rest (scaled to 0),
    // growing in on hover and keyboard focus: a ::before covering the
    // control's own box, a low-opacity fill animated via transform scale
    // rather than opacity, gray at rest and switched to the primary color
    // by the checked-state variant below - an explicit var per state
    // rather than currentColor, since this slot's own text color isn't
    // otherwise tied to checked/unchecked here. scale(0)/scale(1) use
    // Tailwind's arbitrary-value [transform:] syntax, not the named
    // scale-0/scale-100 utilities - those silently failed to generate any
    // CSS in this project's Tailwind v4 setup even though other before:
    // utilities on the same element worked fine; not worth chasing why,
    // arbitrary values sidestep it reliably. -z-10 keeps it behind the
    // ring/dot rather than covering them; the existing focus-visible:
    // outline stays alongside it rather than being replaced, since a
    // 20%-opacity halo alone is a weaker focus indicator than what every
    // other form control in this library already uses.
    item: 'relative flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[var(--ui-bg)] ring-1 ring-inset ring-[var(--ui-border)] transition-colors before:absolute before:-inset-2 before:-z-10 before:[transform:scale(0)] before:rounded-full before:bg-[var(--ui-border)] before:opacity-20 before:transition-transform before:duration-200 before:content-[\'\'] hover:before:[transform:scale(1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)] focus-visible:before:[transform:scale(1)] data-[state=checked]:ring-[var(--ui-primary)] data-[state=checked]:before:bg-[var(--ui-primary)]',
    indicator: 'size-2 rounded-full bg-[var(--ui-primary)]',
    label: 'select-none text-sm text-[var(--ui-text)]',
  },
  variants: {
    invalid: {
      true: { item: 'outline outline-2 outline-offset-1 outline-[var(--ui-danger)]' },
    },
  },
})

export type RadioGroupSlots = keyof (typeof radioGroupTheme)['slots']
