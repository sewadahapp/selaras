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
      danger: '',
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

    { color: 'danger', variant: 'solid', class: { base: 'bg-[var(--ui-danger)] text-white hover:bg-[var(--ui-danger-hover)]' } },
    { color: 'danger', variant: 'soft', class: { base: 'bg-[var(--ui-danger)]/10 text-[var(--ui-danger)] hover:bg-[var(--ui-danger)]/15' } },
    { color: 'danger', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-danger)] text-[var(--ui-danger)] hover:bg-[var(--ui-danger)]/10' } },
    { color: 'danger', variant: 'ghost', class: { base: 'text-[var(--ui-danger)] hover:bg-[var(--ui-danger)]/10' } },
  ],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
})

export type ButtonSlots = keyof (typeof buttonTheme)['slots']
