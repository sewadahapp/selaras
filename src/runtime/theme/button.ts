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
    },
    size: {
      sm: { base: 'h-8 px-3 text-sm', leadingIcon: 'size-4', trailingIcon: 'size-4' },
      md: { base: 'h-10 px-4 text-sm', leadingIcon: 'size-4.5', trailingIcon: 'size-4.5' },
      lg: { base: 'h-11 px-5 text-base', leadingIcon: 'size-5', trailingIcon: 'size-5' },
    },
    block: {
      true: { base: 'w-full' },
    },
  },
  compoundVariants: [
    { color: 'primary', variant: 'solid', class: { base: 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] hover:bg-[var(--ui-primary-hover)]' } },
    { color: 'primary', variant: 'soft', class: { base: 'bg-[var(--ui-primary-soft)] text-[var(--ui-primary)] hover:bg-[var(--ui-primary-soft)]/70' } },
    { color: 'primary', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-primary)] text-[var(--ui-primary)] hover:bg-[var(--ui-primary-soft)]' } },
    { color: 'primary', variant: 'ghost', class: { base: 'text-[var(--ui-primary)] hover:bg-[var(--ui-primary-soft)]' } },

    { color: 'neutral', variant: 'solid', class: { base: 'bg-[var(--ui-bg-inverted)] text-[var(--ui-text-inverted)] hover:opacity-90' } },
    { color: 'neutral', variant: 'soft', class: { base: 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text)] hover:bg-[var(--ui-border)]' } },
    { color: 'neutral', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-border)] text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)]' } },
    { color: 'neutral', variant: 'ghost', class: { base: 'text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)]' } },

    { color: 'secondary', variant: 'solid', class: { base: 'bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)] hover:bg-[var(--ui-secondary-hover)]' } },
    { color: 'secondary', variant: 'soft', class: { base: 'bg-[var(--ui-secondary-soft)] text-[var(--ui-secondary)] hover:bg-[var(--ui-secondary-soft)]/70' } },
    { color: 'secondary', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-secondary)] text-[var(--ui-secondary)] hover:bg-[var(--ui-secondary-soft)]' } },
    { color: 'secondary', variant: 'ghost', class: { base: 'text-[var(--ui-secondary)] hover:bg-[var(--ui-secondary-soft)]' } },

    { color: 'success', variant: 'solid', class: { base: 'bg-[var(--ui-success)] text-[var(--ui-success-foreground)] hover:bg-[var(--ui-success-hover)]' } },
    { color: 'success', variant: 'soft', class: { base: 'bg-[var(--ui-success-soft)] text-[var(--ui-success)] hover:bg-[var(--ui-success-soft)]/70' } },
    { color: 'success', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-success)] text-[var(--ui-success)] hover:bg-[var(--ui-success-soft)]' } },
    { color: 'success', variant: 'ghost', class: { base: 'text-[var(--ui-success)] hover:bg-[var(--ui-success-soft)]' } },

    { color: 'danger', variant: 'solid', class: { base: 'bg-[var(--ui-danger)] text-[var(--ui-danger-foreground)] hover:bg-[var(--ui-danger-hover)]' } },
    { color: 'danger', variant: 'soft', class: { base: 'bg-[var(--ui-danger-soft)] text-[var(--ui-danger)] hover:bg-[var(--ui-danger-soft)]/70' } },
    { color: 'danger', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-danger)] text-[var(--ui-danger)] hover:bg-[var(--ui-danger-soft)]' } },
    { color: 'danger', variant: 'ghost', class: { base: 'text-[var(--ui-danger)] hover:bg-[var(--ui-danger-soft)]' } },

    { color: 'info', variant: 'solid', class: { base: 'bg-[var(--ui-info)] text-[var(--ui-info-foreground)] hover:bg-[var(--ui-info-hover)]' } },
    { color: 'info', variant: 'soft', class: { base: 'bg-[var(--ui-info-soft)] text-[var(--ui-info)] hover:bg-[var(--ui-info-soft)]/70' } },
    { color: 'info', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-info)] text-[var(--ui-info)] hover:bg-[var(--ui-info-soft)]' } },
    { color: 'info', variant: 'ghost', class: { base: 'text-[var(--ui-info)] hover:bg-[var(--ui-info-soft)]' } },

    { color: 'warning', variant: 'solid', class: { base: 'bg-[var(--ui-warning)] text-[var(--ui-warning-foreground)] hover:bg-[var(--ui-warning-hover)]' } },
    { color: 'warning', variant: 'soft', class: { base: 'bg-[var(--ui-warning-soft)] text-[var(--ui-warning)] hover:bg-[var(--ui-warning-soft)]/70' } },
    { color: 'warning', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-warning)] text-[var(--ui-warning)] hover:bg-[var(--ui-warning-soft)]' } },
    { color: 'warning', variant: 'ghost', class: { base: 'text-[var(--ui-warning)] hover:bg-[var(--ui-warning-soft)]' } },
  ],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
})

export type ButtonSlots = keyof (typeof buttonTheme)['slots']
