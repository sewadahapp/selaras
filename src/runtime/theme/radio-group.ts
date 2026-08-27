import { tv } from 'tailwind-variants'

export const radioGroupTheme = tv({
  slots: {
    root: 'flex flex-col gap-2',
    itemWrapper: 'inline-flex items-center gap-2 cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50',
    // The item itself is a hollow ring (transparent center, no fill) so
    // that the before:* radial halo below can show through it as one
    // continuous disc rather than being blocked by an opaque background -
    // a soft circular "state layer" sitting behind the ring, twice the
    // item's own diameter (an inset of half that diameter on each side),
    // invisible at rest (scaled to 0), growing in on hover and keyboard
    // focus. Fill animated via transform scale rather than opacity, gray
    // at rest and switched to the primary color by the checked-state
    // variant below - an explicit var per state rather than currentColor,
    // since this slot's own text color isn't otherwise tied to
    // checked/unchecked here. Uses --ui-text-muted rather than the
    // lighter --ui-border for the gray fill - the border color reads as
    // basically invisible at any reasonable opacity since it's already
    // very close to the page background, whereas a mid-gray text color
    // stays visible even at a fairly low opacity. scale(0)/scale(1) use
    // Tailwind's arbitrary-value [transform:] syntax, not the named
    // scale-0/scale-100 utilities - those silently failed to generate any
    // CSS in this project's Tailwind v4 setup even though other before:
    // utilities on the same element worked fine; not worth chasing why,
    // arbitrary values sidestep it reliably. -z-10 keeps it behind the
    // ring/dot rather than covering them; keyboard focus relies on the
    // halo alone (no separate focus-visible:outline box) since the halo
    // itself already grows on focus-visible and a second, crisper outline
    // on top of it read as redundant. `isolate` is load-bearing
    // here, not decorative - without it, `relative` alone doesn't give
    // the item its own stacking context, so the -z-10 pseudo escapes all
    // the way up to the page's root stacking context instead of staying
    // scoped to this element. Any ancestor between the item and <body>
    // that has an opaque background but no stacking context of its own
    // (true of every plain Tailwind utility div, including this library's
    // own page layout wrapper) then paints *after* that root-level
    // negative-z layer and fully covers it - found by comparing a real
    // page render against an isolated one: identical computed styles,
    // completely invisible halo on the real page, and
    // document.elementsFromPoint() at the halo's own pixels confirmed an
    // ancestor's background was winning the paint order despite being
    // nested outside the button in the DOM.
    item: 'relative isolate flex size-4.5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-[var(--ui-border)] transition-colors before:absolute before:-inset-[9px] before:-z-10 before:[transform:scale(0)] before:rounded-full before:bg-[var(--ui-text-muted)] before:opacity-35 before:transition-transform before:duration-200 before:content-[\'\'] hover:before:[transform:scale(1)] focus-visible:outline-none focus-visible:before:[transform:scale(1)] data-[state=checked]:ring-[var(--ui-primary)] data-[state=checked]:before:bg-[var(--ui-primary)]',
    // force-mount (see RadioGroup.vue) keeps this in the DOM for every
    // item regardless of checked state, so switching the selection scales
    // the old dot out and the new one in instead of an abrupt pop -
    // needed because this project's Presence-driven show/hide only
    // coordinates exit animations for real @keyframes animations (it
    // detects them via computed animation-name), not plain CSS
    // transitions, so a transition-only version without force-mount would
    // just vanish instantly.
    indicator: 'size-2 rounded-full bg-[var(--ui-primary)] [transform:scale(0)] transition-transform duration-200 data-[state=checked]:[transform:scale(1)]',
    label: 'select-none text-sm text-[var(--ui-text)]',
  },
  variants: {
    invalid: {
      true: { item: 'outline outline-2 outline-offset-1 outline-[var(--ui-danger)]' },
    },
  },
})

export type RadioGroupSlots = keyof (typeof radioGroupTheme)['slots']
