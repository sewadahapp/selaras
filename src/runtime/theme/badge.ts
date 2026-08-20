import { tv } from 'tailwind-variants'

export const badgeTheme = tv({
  slots: {
    base: 'inline-flex items-center gap-1 font-medium rounded-[var(--ui-radius-sm)] whitespace-nowrap',
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
      sm: { base: 'h-5 px-1.5 text-xs' },
      md: { base: 'h-6 px-2 text-xs' },
      lg: { base: 'h-7 px-2.5 text-sm' },
    },
  },
  compoundVariants: [
    { color: 'primary', variant: 'solid', class: { base: 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]' } },
    { color: 'primary', variant: 'soft', class: { base: 'bg-[var(--ui-primary-soft)] text-[var(--ui-primary)]' } },
    { color: 'primary', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-primary)] text-[var(--ui-primary)]' } },

    { color: 'neutral', variant: 'solid', class: { base: 'bg-[var(--ui-bg-inverted)] text-[var(--ui-text-inverted)]' } },
    { color: 'neutral', variant: 'soft', class: { base: 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text)]' } },
    { color: 'neutral', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-border)] text-[var(--ui-text)]' } },

    { color: 'secondary', variant: 'solid', class: { base: 'bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)]' } },
    { color: 'secondary', variant: 'soft', class: { base: 'bg-[var(--ui-secondary-soft)] text-[var(--ui-secondary)]' } },
    { color: 'secondary', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-secondary)] text-[var(--ui-secondary)]' } },

    { color: 'success', variant: 'solid', class: { base: 'bg-[var(--ui-success)] text-[var(--ui-success-foreground)]' } },
    { color: 'success', variant: 'soft', class: { base: 'bg-[var(--ui-success-soft)] text-[var(--ui-success)]' } },
    { color: 'success', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-success)] text-[var(--ui-success)]' } },

    { color: 'danger', variant: 'solid', class: { base: 'bg-[var(--ui-danger)] text-[var(--ui-danger-foreground)]' } },
    { color: 'danger', variant: 'soft', class: { base: 'bg-[var(--ui-danger-soft)] text-[var(--ui-danger)]' } },
    { color: 'danger', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-danger)] text-[var(--ui-danger)]' } },

    { color: 'info', variant: 'solid', class: { base: 'bg-[var(--ui-info)] text-[var(--ui-info-foreground)]' } },
    { color: 'info', variant: 'soft', class: { base: 'bg-[var(--ui-info-soft)] text-[var(--ui-info)]' } },
    { color: 'info', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-info)] text-[var(--ui-info)]' } },

    { color: 'warning', variant: 'solid', class: { base: 'bg-[var(--ui-warning)] text-[var(--ui-warning-foreground)]' } },
    { color: 'warning', variant: 'soft', class: { base: 'bg-[var(--ui-warning-soft)] text-[var(--ui-warning)]' } },
    { color: 'warning', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-warning)] text-[var(--ui-warning)]' } },
  ],
  defaultVariants: {
    color: 'neutral',
    variant: 'soft',
    size: 'md',
  },
})

export type BadgeSlots = keyof (typeof badgeTheme)['slots']
