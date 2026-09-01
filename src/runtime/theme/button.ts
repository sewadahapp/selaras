import { tv } from 'tailwind-variants'

export const buttonTheme = tv({
  slots: {
    base: 'inline-flex items-center justify-center gap-1.5 font-medium rounded-[var(--ui-radius-md)] transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)]',
    leadingIcon: 'shrink-0',
    trailingIcon: 'shrink-0',
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
      ghost: '',
      text: '',
    },
    size: {
      sm: { base: 'h-8 px-3 text-sm', leadingIcon: 'size-4', trailingIcon: 'size-4' },
      md: { base: 'h-10 px-4 text-sm', leadingIcon: 'size-4.5', trailingIcon: 'size-4.5' },
      lg: { base: 'h-11 px-5 text-base', leadingIcon: 'size-5', trailingIcon: 'size-5' },
    },
    block: {
      true: { base: 'w-full' },
    },
    raised: {
      true: { base: 'shadow-[var(--ui-shadow-md)]' },
    },
    square: {
      true: {},
    },
  },
  compoundVariants: [
    // Icon-only: swap the size's text-oriented horizontal padding for an
    // equal-width square matching its own height.
    { size: 'sm', square: true, class: { base: 'w-8 px-0' } },
    { size: 'md', square: true, class: { base: 'w-10 px-0' } },
    { size: 'lg', square: true, class: { base: 'w-11 px-0' } },

    // :active (mouse-down) always goes one step further than :hover in the
    // same direction - solid presses to the -active (700) token, soft/
    // outline/ghost (which have no visible bg by default, or a pale -soft
    // one on hover) press to a stronger tint of the role's own main color
    // rather than a new token. Tailwind's default variant order puts
    // active after hover, so :active wins when both apply (mouse down
    // while hovering) - no extra specificity needed.
    { color: 'primary', variant: 'solid', class: { base: 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] hover:bg-[var(--ui-primary-hover)] active:bg-[var(--ui-primary-active)]' } },
    { color: 'primary', variant: 'soft', class: { base: 'bg-[var(--ui-primary-soft)] text-[var(--ui-primary)] hover:bg-[var(--ui-primary-soft)]/70 active:bg-[var(--ui-primary)]/20' } },
    { color: 'primary', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-primary)] text-[var(--ui-primary)] hover:bg-[var(--ui-primary-soft)] active:bg-[var(--ui-primary)]/10' } },
    { color: 'primary', variant: 'ghost', class: { base: 'text-[var(--ui-primary)] hover:bg-[var(--ui-primary-soft)] active:bg-[var(--ui-primary)]/10' } },

    { color: 'neutral', variant: 'solid', class: { base: 'bg-[var(--ui-bg-inverted)] text-[var(--ui-text-inverted)] hover:opacity-90 active:opacity-80' } },
    { color: 'neutral', variant: 'soft', class: { base: 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text)] hover:bg-[var(--ui-border)] active:bg-[var(--ui-border-hover)]' } },
    { color: 'neutral', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-border)] text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)] active:bg-[var(--ui-border)]' } },
    { color: 'neutral', variant: 'ghost', class: { base: 'text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)] active:bg-[var(--ui-border)]' } },

    { color: 'secondary', variant: 'solid', class: { base: 'bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)] hover:bg-[var(--ui-secondary-hover)] active:bg-[var(--ui-secondary-active)]' } },
    { color: 'secondary', variant: 'soft', class: { base: 'bg-[var(--ui-secondary-soft)] text-[var(--ui-secondary)] hover:bg-[var(--ui-secondary-soft)]/70 active:bg-[var(--ui-secondary)]/20' } },
    { color: 'secondary', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-secondary)] text-[var(--ui-secondary)] hover:bg-[var(--ui-secondary-soft)] active:bg-[var(--ui-secondary)]/10' } },
    { color: 'secondary', variant: 'ghost', class: { base: 'text-[var(--ui-secondary)] hover:bg-[var(--ui-secondary-soft)] active:bg-[var(--ui-secondary)]/10' } },

    { color: 'success', variant: 'solid', class: { base: 'bg-[var(--ui-success)] text-[var(--ui-success-foreground)] hover:bg-[var(--ui-success-hover)] active:bg-[var(--ui-success-active)]' } },
    { color: 'success', variant: 'soft', class: { base: 'bg-[var(--ui-success-soft)] text-[var(--ui-success)] hover:bg-[var(--ui-success-soft)]/70 active:bg-[var(--ui-success)]/20' } },
    { color: 'success', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-success)] text-[var(--ui-success)] hover:bg-[var(--ui-success-soft)] active:bg-[var(--ui-success)]/10' } },
    { color: 'success', variant: 'ghost', class: { base: 'text-[var(--ui-success)] hover:bg-[var(--ui-success-soft)] active:bg-[var(--ui-success)]/10' } },

    { color: 'danger', variant: 'solid', class: { base: 'bg-[var(--ui-danger)] text-[var(--ui-danger-foreground)] hover:bg-[var(--ui-danger-hover)] active:bg-[var(--ui-danger-active)]' } },
    { color: 'danger', variant: 'soft', class: { base: 'bg-[var(--ui-danger-soft)] text-[var(--ui-danger)] hover:bg-[var(--ui-danger-soft)]/70 active:bg-[var(--ui-danger)]/20' } },
    { color: 'danger', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-danger)] text-[var(--ui-danger)] hover:bg-[var(--ui-danger-soft)] active:bg-[var(--ui-danger)]/10' } },
    { color: 'danger', variant: 'ghost', class: { base: 'text-[var(--ui-danger)] hover:bg-[var(--ui-danger-soft)] active:bg-[var(--ui-danger)]/10' } },

    { color: 'info', variant: 'solid', class: { base: 'bg-[var(--ui-info)] text-[var(--ui-info-foreground)] hover:bg-[var(--ui-info-hover)] active:bg-[var(--ui-info-active)]' } },
    { color: 'info', variant: 'soft', class: { base: 'bg-[var(--ui-info-soft)] text-[var(--ui-info)] hover:bg-[var(--ui-info-soft)]/70 active:bg-[var(--ui-info)]/20' } },
    { color: 'info', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-info)] text-[var(--ui-info)] hover:bg-[var(--ui-info-soft)] active:bg-[var(--ui-info)]/10' } },
    { color: 'info', variant: 'ghost', class: { base: 'text-[var(--ui-info)] hover:bg-[var(--ui-info-soft)] active:bg-[var(--ui-info)]/10' } },

    { color: 'warning', variant: 'solid', class: { base: 'bg-[var(--ui-warning)] text-[var(--ui-warning-foreground)] hover:bg-[var(--ui-warning-hover)] active:bg-[var(--ui-warning-active)]' } },
    { color: 'warning', variant: 'soft', class: { base: 'bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] hover:bg-[var(--ui-warning-soft)]/70 active:bg-[var(--ui-warning)]/20' } },
    { color: 'warning', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-warning)] text-[var(--ui-warning)] hover:bg-[var(--ui-warning-soft)] active:bg-[var(--ui-warning)]/10' } },
    { color: 'warning', variant: 'ghost', class: { base: 'text-[var(--ui-warning)] hover:bg-[var(--ui-warning-soft)] active:bg-[var(--ui-warning)]/10' } },

    // `text`: for an icon button sitting tight against another control's own
    // border (a field's clear button, a stepper) - `ghost`'s hover background
    // fill would visually compete with that adjacent border, so this variant
    // never paints a background at any state and only shifts the text/icon
    // color on hover.
    { color: 'primary', variant: 'text', class: { base: 'text-[var(--ui-primary)] hover:text-[var(--ui-primary-hover)]' } },
    { color: 'neutral', variant: 'text', class: { base: 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]' } },
    { color: 'secondary', variant: 'text', class: { base: 'text-[var(--ui-secondary)] hover:text-[var(--ui-secondary-hover)]' } },
    { color: 'success', variant: 'text', class: { base: 'text-[var(--ui-success)] hover:text-[var(--ui-success-hover)]' } },
    { color: 'danger', variant: 'text', class: { base: 'text-[var(--ui-danger)] hover:text-[var(--ui-danger-hover)]' } },
    { color: 'info', variant: 'text', class: { base: 'text-[var(--ui-info)] hover:text-[var(--ui-info-hover)]' } },
    { color: 'warning', variant: 'text', class: { base: 'text-[var(--ui-warning)] hover:text-[var(--ui-warning-hover)]' } },
  ],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
})

export type ButtonThemeSlots = keyof (typeof buttonTheme)['slots']
