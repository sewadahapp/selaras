import { tv } from 'tailwind-variants'

export const textareaTheme = tv({
  slots: {
    base: 'w-full resize-y rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text)] ring-1 ring-inset ring-[var(--ui-border)] placeholder:text-[var(--ui-text-muted)] outline-none transition-[color,background-color,box-shadow] hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus:ring-2 focus:ring-[var(--ui-primary)] disabled:opacity-50 disabled:pointer-events-none disabled:resize-none',
  },
  variants: {
    size: {
      sm: { base: 'text-sm' },
      md: { base: 'text-sm' },
      lg: { base: 'text-base' },
    },
    invalid: {
      true: { base: 'ring-[var(--ui-danger)] hover:ring-[var(--ui-danger)] focus:ring-[var(--ui-danger)]' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type TextareaSlots = keyof (typeof textareaTheme)['slots']
