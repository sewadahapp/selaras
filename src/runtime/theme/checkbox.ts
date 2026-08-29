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
    box: 'relative isolate flex shrink-0 items-center justify-center rounded-[var(--ui-radius-sm)] ring-[1.5px] ring-inset ring-[var(--ui-border)] transition-colors before:absolute before:-z-10 before:[transform:scale(0)] before:rounded-full before:bg-[var(--ui-border-hover)] before:opacity-35 before:transition-transform before:duration-200 before:content-[\'\'] hover:before:[transform:scale(1)] focus-visible:outline-none focus-visible:before:[transform:scale(1)]',
    indicator: 'flex items-center justify-center',
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
    description: 'select-none text-xs text-[var(--ui-text-muted)]',
  },
  variants: {
    // Recolors the existing ring rather than adding a second outline
    // outside it, matching the same fix made on RadioGroup - see its
    // theme file for why. data-[state=checked]/indeterminate need their
    // own danger override too, for the same reason.
    invalid: {
      true: { box: 'ring-[var(--ui-danger)] data-[state=checked]:ring-[var(--ui-danger)] data-[state=indeterminate]:ring-[var(--ui-danger)]' },
    },
    // Fills/rings the box in the given color when checked/indeterminate,
    // and colors the checkmark stroke (via the indicator's own
    // `currentColor`) with that color's matching foreground token - same
    // pairing Button's own `solid` variant already uses. Unchecked always
    // stays the same neutral ring regardless of `color`.
    color: {
      primary: {
        box: 'data-[state=checked]:bg-[var(--ui-primary)] data-[state=checked]:ring-[var(--ui-primary)] data-[state=checked]:before:bg-[var(--ui-primary)] data-[state=indeterminate]:bg-[var(--ui-primary)] data-[state=indeterminate]:ring-[var(--ui-primary)] data-[state=indeterminate]:before:bg-[var(--ui-primary)]',
        indicator: 'text-[var(--ui-primary-foreground)]',
      },
      neutral: {
        box: 'data-[state=checked]:bg-[var(--ui-bg-inverted)] data-[state=checked]:ring-[var(--ui-bg-inverted)] data-[state=checked]:before:bg-[var(--ui-bg-inverted)] data-[state=indeterminate]:bg-[var(--ui-bg-inverted)] data-[state=indeterminate]:ring-[var(--ui-bg-inverted)] data-[state=indeterminate]:before:bg-[var(--ui-bg-inverted)]',
        indicator: 'text-[var(--ui-text-inverted)]',
      },
      secondary: {
        box: 'data-[state=checked]:bg-[var(--ui-secondary)] data-[state=checked]:ring-[var(--ui-secondary)] data-[state=checked]:before:bg-[var(--ui-secondary)] data-[state=indeterminate]:bg-[var(--ui-secondary)] data-[state=indeterminate]:ring-[var(--ui-secondary)] data-[state=indeterminate]:before:bg-[var(--ui-secondary)]',
        indicator: 'text-[var(--ui-secondary-foreground)]',
      },
      success: {
        box: 'data-[state=checked]:bg-[var(--ui-success)] data-[state=checked]:ring-[var(--ui-success)] data-[state=checked]:before:bg-[var(--ui-success)] data-[state=indeterminate]:bg-[var(--ui-success)] data-[state=indeterminate]:ring-[var(--ui-success)] data-[state=indeterminate]:before:bg-[var(--ui-success)]',
        indicator: 'text-[var(--ui-success-foreground)]',
      },
      danger: {
        box: 'data-[state=checked]:bg-[var(--ui-danger)] data-[state=checked]:ring-[var(--ui-danger)] data-[state=checked]:before:bg-[var(--ui-danger)] data-[state=indeterminate]:bg-[var(--ui-danger)] data-[state=indeterminate]:ring-[var(--ui-danger)] data-[state=indeterminate]:before:bg-[var(--ui-danger)]',
        indicator: 'text-[var(--ui-danger-foreground)]',
      },
      info: {
        box: 'data-[state=checked]:bg-[var(--ui-info)] data-[state=checked]:ring-[var(--ui-info)] data-[state=checked]:before:bg-[var(--ui-info)] data-[state=indeterminate]:bg-[var(--ui-info)] data-[state=indeterminate]:ring-[var(--ui-info)] data-[state=indeterminate]:before:bg-[var(--ui-info)]',
        indicator: 'text-[var(--ui-info-foreground)]',
      },
      warning: {
        box: 'data-[state=checked]:bg-[var(--ui-warning)] data-[state=checked]:ring-[var(--ui-warning)] data-[state=checked]:before:bg-[var(--ui-warning)] data-[state=indeterminate]:bg-[var(--ui-warning)] data-[state=indeterminate]:ring-[var(--ui-warning)] data-[state=indeterminate]:before:bg-[var(--ui-warning)]',
        indicator: 'text-[var(--ui-warning-foreground)]',
      },
    },
    // Same +4px-per-step scale RadioGroup's own `size` variant uses.
    size: {
      sm: { box: 'size-3.5 before:-inset-[7px]', indicator: 'size-2.5', label: 'text-xs', description: 'text-xs' },
      md: { box: 'size-4.5 before:-inset-[9px]', indicator: 'size-3.5', label: 'text-sm', description: 'text-xs' },
      lg: { box: 'size-5.5 before:-inset-[11px]', indicator: 'size-4', label: 'text-base', description: 'text-sm' },
    },
    // Wraps the checkbox+label in a bordered box, highlighted when
    // checked - same pattern already proven on RadioGroup's own `card`
    // variant (see radio-group.ts), applied here to root/box instead of
    // itemWrapper/item since there's one control, not a list.
    variant: {
      default: {},
      card: {
        root: 'w-full items-start gap-3 rounded-[var(--ui-radius-md)] border border-[var(--ui-border)] px-3.5 py-3 transition-colors has-[[data-state=checked]]:border-[var(--ui-primary)] has-[[data-state=checked]]:bg-[var(--ui-primary-soft)]',
        box: 'mt-0.5',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

export type CheckboxSlots = keyof (typeof checkboxTheme)['slots']
