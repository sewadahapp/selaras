import { tv } from 'tailwind-variants'

export const chipTheme = tv({
  slots: {
    // rounded-sm by default, same as Badge's own shape - `rounded` opts a
    // specific chip into the fully-rounded pill look instead. Padding/
    // height below is Badge's original scale, carried over here; Badge
    // itself moved to a tighter one (see badge.ts).
    root: 'inline-flex items-center gap-1 rounded-[var(--ui-radius-sm)] font-medium whitespace-nowrap',
    leadingIcon: 'shrink-0',
    label: 'truncate',
    // inline-flex items-center justify-center centers the icon in both
    // axes and keeps the button's own box vertically centered against the
    // label's line box via the root's items-center, not just tall enough
    // to look right by accident (the exact bug already fixed once for
    // Input/Select's clear button - a plain <button> with no centering
    // inherits ambient line-height on height only).
    remove: 'inline-flex shrink-0 items-center justify-center rounded-full p-0.5 opacity-70 transition-[opacity,background-color] hover:opacity-100 hover:bg-current/10 active:bg-current/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:opacity-30 disabled:pointer-events-none',
    removeIcon: 'shrink-0',
  },
  variants: {
    color: {
      primary: '',
      neutral: '',
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    variant: {
      solid: '',
      soft: '',
      outline: '',
    },
    size: {
      sm: { root: 'h-5 px-1.5 text-xs', leadingIcon: 'size-3', removeIcon: 'size-3' },
      md: { root: 'h-6 px-2 text-xs', leadingIcon: 'size-3.5', removeIcon: 'size-3.5' },
      lg: { root: 'h-7 px-2.5 text-sm', leadingIcon: 'size-4', removeIcon: 'size-4' },
    },
    rounded: {
      true: { root: 'rounded-full' },
    },
    disabled: {
      true: { root: 'opacity-50 pointer-events-none' },
    },
    // The remove button's own p-0.5 (plus its hover-circle inset) already
    // adds visual weight on the right, so root's right padding trims down
    // one step per size to compensate - left padding is untouched.
    removable: {
      true: {},
    },
  },
  compoundVariants: [
    { size: 'sm', removable: true, class: { root: 'pr-1' } },
    { size: 'md', removable: true, class: { root: 'pr-1.5' } },
    { size: 'lg', removable: true, class: { root: 'pr-2' } },

    { color: 'primary', variant: 'solid', class: { root: 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]' } },
    { color: 'primary', variant: 'soft', class: { root: 'bg-[var(--ui-primary-soft)] text-[var(--ui-primary)]' } },
    { color: 'primary', variant: 'outline', class: { root: 'ring-1 ring-inset ring-[var(--ui-primary)] text-[var(--ui-primary)]' } },

    { color: 'neutral', variant: 'solid', class: { root: 'bg-[var(--ui-bg-inverted)] text-[var(--ui-text-inverted)]' } },
    { color: 'neutral', variant: 'soft', class: { root: 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text)]' } },
    { color: 'neutral', variant: 'outline', class: { root: 'ring-1 ring-inset ring-[var(--ui-border)] text-[var(--ui-text)]' } },

    { color: 'secondary', variant: 'solid', class: { root: 'bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)]' } },
    { color: 'secondary', variant: 'soft', class: { root: 'bg-[var(--ui-secondary-soft)] text-[var(--ui-secondary)]' } },
    { color: 'secondary', variant: 'outline', class: { root: 'ring-1 ring-inset ring-[var(--ui-secondary)] text-[var(--ui-secondary)]' } },

    { color: 'success', variant: 'solid', class: { root: 'bg-[var(--ui-success)] text-[var(--ui-success-foreground)]' } },
    { color: 'success', variant: 'soft', class: { root: 'bg-[var(--ui-success-soft)] text-[var(--ui-success)]' } },
    { color: 'success', variant: 'outline', class: { root: 'ring-1 ring-inset ring-[var(--ui-success)] text-[var(--ui-success)]' } },

    { color: 'danger', variant: 'solid', class: { root: 'bg-[var(--ui-danger)] text-[var(--ui-danger-foreground)]' } },
    { color: 'danger', variant: 'soft', class: { root: 'bg-[var(--ui-danger-soft)] text-[var(--ui-danger)]' } },
    { color: 'danger', variant: 'outline', class: { root: 'ring-1 ring-inset ring-[var(--ui-danger)] text-[var(--ui-danger)]' } },

    { color: 'info', variant: 'solid', class: { root: 'bg-[var(--ui-info)] text-[var(--ui-info-foreground)]' } },
    { color: 'info', variant: 'soft', class: { root: 'bg-[var(--ui-info-soft)] text-[var(--ui-info)]' } },
    { color: 'info', variant: 'outline', class: { root: 'ring-1 ring-inset ring-[var(--ui-info)] text-[var(--ui-info)]' } },

    { color: 'warning', variant: 'solid', class: { root: 'bg-[var(--ui-warning)] text-[var(--ui-warning-foreground)]' } },
    { color: 'warning', variant: 'soft', class: { root: 'bg-[var(--ui-warning-soft)] text-[var(--ui-warning)]' } },
    { color: 'warning', variant: 'outline', class: { root: 'ring-1 ring-inset ring-[var(--ui-warning)] text-[var(--ui-warning)]' } },
  ],
  defaultVariants: {
    color: 'neutral',
    variant: 'soft',
    size: 'md',
  },
})

export type ChipSlots = keyof (typeof chipTheme)['slots']
