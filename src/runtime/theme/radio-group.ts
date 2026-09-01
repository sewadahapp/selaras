import { tv } from 'tailwind-variants'

export const radioGroupTheme = tv({
  slots: {
    root: 'flex',
    // card's has-[[data-state=checked]] targets the RadioGroupItem button
    // rendered directly inside this label, matching the existing
    // has-[[data-disabled]] pattern already used here for the disabled look.
    itemWrapper: 'inline-flex items-center gap-2 cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50',
    // The item itself is a hollow ring (transparent center, no fill) so
    // that the before:* radial halo below can show through it as one
    // continuous disc rather than being blocked by an opaque background -
    // a soft circular "state layer" sitting behind the ring, twice the
    // item's own diameter (an inset of half that diameter on each side,
    // scaled per size variant below), invisible at rest (scaled to 0),
    // growing in on hover and keyboard focus. Fill animated via transform
    // scale rather than opacity, gray at rest and switched to the primary
    // color by the checked-state variant below - an explicit var per
    // state rather than currentColor, since this slot's own text color
    // isn't otherwise tied to checked/unchecked here. Uses
    // --ui-border-hover for the gray fill - lighter than a plain mid-gray
    // text color would give, while still clearing the plain --ui-border
    // token, which reads as basically invisible at any reasonable opacity
    // since it's already very close to the page background. scale(0)/
    // scale(1) use Tailwind's arbitrary-value [transform:] syntax, not the
    // named scale-0/scale-100 utilities - those silently failed to
    // generate any CSS in this project's Tailwind v4 setup even though
    // other before: utilities on the same element worked fine; not worth
    // chasing why, arbitrary values sidestep it reliably. -z-10 keeps it
    // behind the ring/dot rather than covering them; keyboard focus relies
    // on the halo alone (no separate focus-visible:outline box) since the
    // halo itself already grows on focus-visible and a second, crisper
    // outline on top of it read as redundant. `isolate` is load-bearing
    // here, not decorative - without it, `relative` alone doesn't give the
    // item its own stacking context, so the -z-10 pseudo escapes all the
    // way up to the page's root stacking context instead of staying
    // scoped to this element. Any ancestor between the item and <body>
    // that has an opaque background but no stacking context of its own
    // (true of every plain Tailwind utility div, including this library's
    // own page layout wrapper) then paints *after* that root-level
    // negative-z layer and fully covers it - found by comparing a real
    // page render against an isolated one: identical computed styles,
    // completely invisible halo on the real page, and
    // document.elementsFromPoint() at the halo's own pixels confirmed an
    // ancestor's background was winning the paint order despite being
    // nested outside the button in the DOM. ring-[1.5px] rather than the
    // plain ring-1 (1px) utility - a full 1px stroke on an 18px circle
    // rendered visibly jagged at normal (non-zoomed) browser scale; the
    // fractional width needs the arbitrary-value form since Tailwind's
    // named ring scale only has integer steps.
    item: 'relative isolate flex shrink-0 items-center justify-center rounded-full ring-[1.5px] ring-inset ring-[var(--ui-border)] transition-colors before:absolute before:-z-10 before:[transform:scale(0)] before:rounded-full before:bg-[var(--ui-border-hover)] before:opacity-35 before:transition-transform before:duration-200 before:content-[\'\'] hover:before:[transform:scale(1)] focus-visible:outline-none focus-visible:before:[transform:scale(1)]',
    // force-mount (see RadioGroup.vue) keeps this in the DOM for every
    // item regardless of checked state, so switching the selection scales
    // the old dot out and the new one in instead of an abrupt pop -
    // needed because this project's Presence-driven show/hide only
    // coordinates exit animations for real @keyframes animations (it
    // detects them via computed animation-name), not plain CSS
    // transitions, so a transition-only version without force-mount would
    // just vanish instantly.
    indicator: 'rounded-full [transform:scale(0)] transition-transform duration-200 data-[state=checked]:[transform:scale(1)]',
    label: 'select-none text-[var(--ui-text)]',
    description: 'block select-none text-[var(--ui-text-muted)]',
  },
  variants: {
    size: {
      sm: { item: 'size-3.5 before:-inset-[7px]', indicator: 'size-2', label: 'text-xs', description: 'text-xs' },
      md: { item: 'size-4.5 before:-inset-[9px]', indicator: 'size-2.5', label: 'text-sm', description: 'text-xs' },
      lg: { item: 'size-5.5 before:-inset-[11px]', indicator: 'size-3', label: 'text-base', description: 'text-sm' },
    },
    orientation: {
      vertical: { root: 'flex-col gap-2' },
      horizontal: { root: 'flex-row flex-wrap gap-x-6 gap-y-2' },
    },
    // card wraps each item in its own bordered box (a common alternative
    // to the plain inline list, useful for pairing a description or price
    // with the option via the label slot) - selected state comes from the
    // same has-[[data-state=checked]] the disabled look already uses. The
    // color-dependent part of that highlight (border/background tint)
    // lives in the compoundVariants below instead, since it has to follow
    // `color` - this block only keeps the structural bits.
    variant: {
      default: {},
      card: {
        itemWrapper: 'w-full items-start gap-3 rounded-[var(--ui-radius-md)] border border-[var(--ui-border)] px-3.5 py-3 transition-colors',
        item: 'mt-0.5',
      },
    },
    // Recolors the ring/dot when checked - unchecked always stays the same
    // neutral ring regardless of `color`, matching Checkbox's/Switch's own
    // `color` variant exactly (same reasoning, same token pattern).
    color: {
      primary: { item: 'data-[state=checked]:ring-[var(--ui-primary)] data-[state=checked]:before:bg-[var(--ui-primary)]', indicator: 'bg-[var(--ui-primary)]' },
      neutral: { item: 'data-[state=checked]:ring-[var(--ui-bg-inverted)] data-[state=checked]:before:bg-[var(--ui-bg-inverted)]', indicator: 'bg-[var(--ui-bg-inverted)]' },
      secondary: { item: 'data-[state=checked]:ring-[var(--ui-secondary)] data-[state=checked]:before:bg-[var(--ui-secondary)]', indicator: 'bg-[var(--ui-secondary)]' },
      success: { item: 'data-[state=checked]:ring-[var(--ui-success)] data-[state=checked]:before:bg-[var(--ui-success)]', indicator: 'bg-[var(--ui-success)]' },
      danger: { item: 'data-[state=checked]:ring-[var(--ui-danger)] data-[state=checked]:before:bg-[var(--ui-danger)]', indicator: 'bg-[var(--ui-danger)]' },
      info: { item: 'data-[state=checked]:ring-[var(--ui-info)] data-[state=checked]:before:bg-[var(--ui-info)]', indicator: 'bg-[var(--ui-info)]' },
      warning: { item: 'data-[state=checked]:ring-[var(--ui-warning)] data-[state=checked]:before:bg-[var(--ui-warning)]', indicator: 'bg-[var(--ui-warning)]' },
    },
    // Recolors the existing ring rather than adding a second outline
    // outside it (an earlier version did that, which read as a double
    // ring) - matches how Input/Select handle their own invalid ring.
    // data-[state=checked] needs its own danger override too, since it'd
    // otherwise win the ring color back whenever an already-invalid group
    // has something selected.
    invalid: {
      true: { item: 'ring-[var(--ui-danger)] data-[state=checked]:ring-[var(--ui-danger)]' },
    },
  },
  compoundVariants: [
    // The card variant's own checked-state highlight, following `color` -
    // neutral has no `-soft` token (nothing else in this codebase gives it
    // one either), so it uses --ui-bg-elevated for the tint and
    // --ui-bg-inverted for the border, matching how every other
    // component's own neutral "soft"-equivalent state already handles this.
    { variant: 'card', color: 'primary', class: { itemWrapper: 'has-[[data-state=checked]]:border-[var(--ui-primary)] has-[[data-state=checked]]:bg-[var(--ui-primary-soft)]' } },
    { variant: 'card', color: 'neutral', class: { itemWrapper: 'has-[[data-state=checked]]:border-[var(--ui-bg-inverted)] has-[[data-state=checked]]:bg-[var(--ui-bg-elevated)]' } },
    { variant: 'card', color: 'secondary', class: { itemWrapper: 'has-[[data-state=checked]]:border-[var(--ui-secondary)] has-[[data-state=checked]]:bg-[var(--ui-secondary-soft)]' } },
    { variant: 'card', color: 'success', class: { itemWrapper: 'has-[[data-state=checked]]:border-[var(--ui-success)] has-[[data-state=checked]]:bg-[var(--ui-success-soft)]' } },
    { variant: 'card', color: 'danger', class: { itemWrapper: 'has-[[data-state=checked]]:border-[var(--ui-danger)] has-[[data-state=checked]]:bg-[var(--ui-danger-soft)]' } },
    { variant: 'card', color: 'info', class: { itemWrapper: 'has-[[data-state=checked]]:border-[var(--ui-info)] has-[[data-state=checked]]:bg-[var(--ui-info-soft)]' } },
    { variant: 'card', color: 'warning', class: { itemWrapper: 'has-[[data-state=checked]]:border-[var(--ui-warning)] has-[[data-state=checked]]:bg-[var(--ui-warning-soft)]' } },
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    orientation: 'vertical',
    variant: 'default',
  },
})

export type RadioGroupThemeSlots = keyof (typeof radioGroupTheme)['slots']
