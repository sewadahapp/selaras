import { tv } from 'tailwind-variants'

export const inputTheme = tv({
  slots: {
    root: 'relative inline-flex items-center w-full',
    base: 'w-full rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] text-[var(--ui-text)] ring-1 ring-inset ring-[var(--ui-border)] placeholder:text-[var(--ui-text-muted)] outline-none transition-[color,background-color,box-shadow] hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus:ring-2 focus:ring-[var(--ui-primary)] disabled:opacity-50 disabled:pointer-events-none',
    leadingIcon: 'absolute left-2.5 shrink-0 text-[var(--ui-text-muted)]',
    trailingIcon: 'absolute right-2.5 shrink-0 text-[var(--ui-text-muted)]',
    // A separate slot from trailingIcon (not reused) - that one is a
    // decorative, non-interactive icon; this is a real dismiss button and
    // needs its own padding/hover/focus-ring/rounded-full, which would be
    // wrong on a purely decorative icon.
    clear: 'absolute right-1.5 shrink-0 rounded-full p-0.5 text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)]',
  },
  variants: {
    size: {
      sm: { base: 'h-8 px-2.5 text-sm', leadingIcon: 'size-4', trailingIcon: 'size-4' },
      md: { base: 'h-10 px-3 text-sm', leadingIcon: 'size-4.5', trailingIcon: 'size-4.5' },
      lg: { base: 'h-11 px-3.5 text-base', leadingIcon: 'size-5', trailingIcon: 'size-5' },
    },
    invalid: {
      true: { base: 'ring-[var(--ui-danger)] hover:ring-[var(--ui-danger)] focus:ring-[var(--ui-danger)]' },
    },
    hasLeadingIcon: {
      true: {},
    },
    hasTrailingIcon: {
      true: {},
    },
  },
  compoundVariants: [
    { size: 'sm', hasLeadingIcon: true, class: { base: 'pl-8' } },
    { size: 'md', hasLeadingIcon: true, class: { base: 'pl-9' } },
    { size: 'lg', hasLeadingIcon: true, class: { base: 'pl-10' } },
    { size: 'sm', hasTrailingIcon: true, class: { base: 'pr-8' } },
    { size: 'md', hasTrailingIcon: true, class: { base: 'pr-9' } },
    { size: 'lg', hasTrailingIcon: true, class: { base: 'pr-10' } },
  ],
  defaultVariants: {
    size: 'md',
  },
})

export type InputSlots = keyof (typeof inputTheme)['slots']
