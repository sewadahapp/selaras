import { tv } from 'tailwind-variants'

export const pinInputTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-2',
    // Mirrors Input.vue's own `base` slot look (theme/input.ts) - same
    // ring/hover/focus/disabled treatment - but square instead of
    // full-width, one box per character.
    input: 'rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] text-center font-medium text-[var(--ui-text)] ring-1 ring-inset ring-[var(--ui-border)] outline-none transition-[color,background-color,box-shadow] not-focus:hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus:ring-2 disabled:opacity-50 disabled:pointer-events-none',
  },
  variants: {
    // Square boxes matching Input's own h-8/h-10/h-11 height scale for
    // both dimensions.
    size: {
      sm: { input: 'size-8 text-sm' },
      md: { input: 'size-10 text-base' },
      lg: { input: 'size-11 text-lg' },
    },
    // Focus-ring color only - the resting ring stays --ui-border
    // regardless, matching Input's own `color` variant exactly.
    color: {
      primary: { input: 'focus:ring-[var(--ui-primary)]' },
      neutral: { input: 'focus:ring-[var(--ui-bg-inverted)]' },
      secondary: { input: 'focus:ring-[var(--ui-secondary)]' },
      success: { input: 'focus:ring-[var(--ui-success)]' },
      danger: { input: 'focus:ring-[var(--ui-danger)]' },
      info: { input: 'focus:ring-[var(--ui-info)]' },
      warning: { input: 'focus:ring-[var(--ui-warning)]' },
    },
    // Declared last (after color) so tailwind-merge lets its own
    // focus:ring override win over color's - matches Input's own
    // documented reasoning for this order.
    invalid: {
      true: { input: 'ring-[var(--ui-danger)] hover:ring-[var(--ui-danger)] focus:ring-[var(--ui-danger)]' },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

export type PinInputThemeSlots = keyof (typeof pinInputTheme)['slots']
