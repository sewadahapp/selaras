import { tv } from 'tailwind-variants'

export const checkboxTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-2 cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50',
    // Ported from RadioGroup's own hover/focus halo (see its theme file for
    // the full derivation) - same mechanism, same size (18px box, 36px
    // halo), same fixes: `isolate` so the halo's -z-10 pseudo keeps its own
    // stacking context instead of leaking to the page root, ring-[1.5px]
    // over plain ring-1 since a 1px stroke on this size circle/box rendered
    // jagged at normal scale, outline-none replacing the old
    // focus-visible:outline box now that the halo itself is the focus
    // indicator. Unlike the radio item, this box keeps its own solid
    // data-[state=checked]/indeterminate background fill (the standard
    // checkbox convention, unlike radio's hollow ring) - the halo still
    // shows correctly layered in front of that fill, since within this
    // element's own isolated stacking context its own background paints
    // first and the negative-z halo paints after it, same as the check
    // icon itself. Only the unchecked resting background was dropped
    // (transparent instead of --ui-bg), the same reason radio's item is
    // hollow - an opaque fill there would block the halo from showing as
    // a full disc instead of a ring cut off by the box's own edge.
    box: 'relative isolate flex size-4.5 shrink-0 items-center justify-center rounded-[var(--ui-radius-sm)] ring-[1.5px] ring-inset ring-[var(--ui-border)] transition-colors before:absolute before:-inset-[9px] before:-z-10 before:[transform:scale(0)] before:rounded-full before:bg-[var(--ui-border-hover)] before:opacity-35 before:transition-transform before:duration-200 before:content-[\'\'] hover:before:[transform:scale(1)] focus-visible:outline-none focus-visible:before:[transform:scale(1)] data-[state=checked]:bg-[var(--ui-primary)] data-[state=checked]:ring-[var(--ui-primary)] data-[state=checked]:before:bg-[var(--ui-primary)] data-[state=indeterminate]:bg-[var(--ui-primary)] data-[state=indeterminate]:ring-[var(--ui-primary)] data-[state=indeterminate]:before:bg-[var(--ui-primary)]',
    indicator: 'flex items-center justify-center text-[var(--ui-primary-foreground)]',
    // A hand-drawn stroke path (not an Icon/icon-registry glyph, unlike
    // every other icon in this library) animated via stroke-dasharray/
    // stroke-dashoffset - the classic "self-drawing" checkmark technique,
    // which needs a real path to control, not an arbitrary swappable
    // Iconify icon. This is a deliberate, one-off exception to the
    // icon-registry pattern documented in use-icons.ts: this glyph isn't
    // overridable via app.config.icons, only restylable (stroke width/
    // color/duration) via these two :ui slots. dasharray/dashoffset are
    // each set to the exact measured length of their own path
    // (path.getTotalLength(), not a guess) so the "draw" finishes exactly
    // at the stroke's own end with no visible overshoot or gap.
    checkIcon: '[stroke-dasharray:20px] [stroke-dashoffset:20px] transition-[stroke-dashoffset] duration-200 data-[state=checked]:[stroke-dashoffset:0]',
    indeterminateIcon: '[stroke-dasharray:14px] [stroke-dashoffset:14px] transition-[stroke-dashoffset] duration-200 data-[state=indeterminate]:[stroke-dashoffset:0]',
    label: 'select-none text-sm text-[var(--ui-text)]',
  },
  variants: {
    // Recolors the existing ring rather than adding a second outline
    // outside it, matching the same fix made on RadioGroup - see its
    // theme file for why. data-[state=checked]/indeterminate need their
    // own danger override too, for the same reason.
    invalid: {
      true: { box: 'ring-[var(--ui-danger)] data-[state=checked]:ring-[var(--ui-danger)] data-[state=indeterminate]:ring-[var(--ui-danger)]' },
    },
  },
})

export type CheckboxSlots = keyof (typeof checkboxTheme)['slots']
