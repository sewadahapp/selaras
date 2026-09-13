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
    // adds visual weight on its own side, so root's end padding (the side
    // the remove button actually renders on, in either direction - it's
    // the last flex child) trims down one step per size to compensate -
    // start padding is untouched.
    removable: {
      true: {},
    },
  },
  compoundVariants: [
    { size: 'sm', removable: true, class: { root: 'pe-1' } },
    { size: 'md', removable: true, class: { root: 'pe-1.5' } },
    { size: 'lg', removable: true, class: { root: 'pe-2' } },

    { variant: 'solid', class: { root: 'bg-[var(--_selaras-color-fill)] text-[var(--_selaras-color-on-fill)]' } },
    { variant: 'soft', class: { root: 'bg-[var(--_selaras-color-subtle)] text-[var(--_selaras-color-text)]' } },
    { variant: 'outline', class: { root: 'ring-1 ring-inset ring-[var(--_selaras-color-border)] text-[var(--_selaras-color-text)]' } },
  ],
  defaultVariants: {
    color: 'neutral',
    variant: 'soft',
    size: 'md',
  },
})

export type ChipThemeSlots = keyof (typeof chipTheme)['slots']
