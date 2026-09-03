import { tv } from 'tailwind-variants'

export const toggleTheme = tv({
  slots: {
    base: 'inline-flex items-center justify-center gap-1.5 font-medium rounded-[var(--ui-radius-md)] transition-colors text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)]',
    icon: 'shrink-0',
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
    size: {
      sm: { base: 'h-8 px-3 text-sm', icon: 'size-4' },
      md: { base: 'h-10 px-4 text-sm', icon: 'size-4.5' },
      lg: { base: 'h-11 px-5 text-base', icon: 'size-5' },
    },
    square: {
      true: {},
    },
  },
  compoundVariants: [
    // Icon-only: swap the size's text-oriented horizontal padding for an
    // equal-width square matching its own height - same technique as
    // Button's own `square` compound variants.
    { size: 'sm', square: true, class: { base: 'w-8 px-0' } },
    { size: 'md', square: true, class: { base: 'w-10 px-0' } },
    { size: 'lg', square: true, class: { base: 'w-11 px-0' } },

    // Pressed (data-[state=on]) - the same soft-variant look Button/Alert/
    // Badge already use for this color at rest, so a pressed Toggle reads
    // as "this color's own settled state" rather than a one-off treatment.
    { color: 'primary', class: { base: 'data-[state=on]:bg-[var(--ui-primary-soft)] data-[state=on]:text-[var(--ui-primary)] data-[state=on]:hover:bg-[var(--ui-primary-soft)]/70' } },
    { color: 'neutral', class: { base: 'data-[state=on]:bg-[var(--ui-bg-elevated)] data-[state=on]:text-[var(--ui-text)] data-[state=on]:hover:bg-[var(--ui-border)]' } },
    { color: 'secondary', class: { base: 'data-[state=on]:bg-[var(--ui-secondary-soft)] data-[state=on]:text-[var(--ui-secondary)] data-[state=on]:hover:bg-[var(--ui-secondary-soft)]/70' } },
    { color: 'success', class: { base: 'data-[state=on]:bg-[var(--ui-success-soft)] data-[state=on]:text-[var(--ui-success)] data-[state=on]:hover:bg-[var(--ui-success-soft)]/70' } },
    { color: 'danger', class: { base: 'data-[state=on]:bg-[var(--ui-danger-soft)] data-[state=on]:text-[var(--ui-danger)] data-[state=on]:hover:bg-[var(--ui-danger-soft)]/70' } },
    { color: 'info', class: { base: 'data-[state=on]:bg-[var(--ui-info-soft)] data-[state=on]:text-[var(--ui-info)] data-[state=on]:hover:bg-[var(--ui-info-soft)]/70' } },
    { color: 'warning', class: { base: 'data-[state=on]:bg-[var(--ui-warning-soft)] data-[state=on]:text-[var(--ui-warning)] data-[state=on]:hover:bg-[var(--ui-warning-soft)]/70' } },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

export type ToggleThemeSlots = keyof (typeof toggleTheme)['slots']
