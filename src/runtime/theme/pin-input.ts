import { tv } from 'tailwind-variants'

export const pinInputTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-2',
    // Mirrors Input.vue's own `base` slot look (theme/input.ts) - same
    // ring/hover/focus/disabled treatment - but square instead of
    // full-width, one box per character.
    input: 'rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] text-center font-medium text-[var(--ui-text)] ring-1 ring-inset ring-[var(--ui-border)] outline-none transition-[color,background-color,box-shadow] not-focus:hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus:ring-2 focus:ring-[var(--_selaras-color-focus)] disabled:opacity-50 disabled:pointer-events-none',
  },
  variants: {
    // Square boxes matching Input's own h-8/h-10/h-11 height scale for
    // both dimensions.
    size: {
      sm: { input: 'size-8 text-sm' },
      md: { input: 'size-10 text-base' },
      lg: { input: 'size-11 text-lg' },
    },
    // Color is intentionally a structural variant: the selected role binds
    // the CSS recipe at the component root. Keeping the known keys lets
    // theme extensions add their own role conditions without coercing a
    // registered custom role back to primary.
    color: {
      primary: {},
      neutral: {},
      secondary: {},
      success: {},
      danger: {},
      info: {},
      warning: {},
    },
    // Declared last (after color) so tailwind-merge lets its own
    // focus:ring override win over color's - matches Input's own
    // documented reasoning for this order.
    invalid: {
      true: { input: 'ring-[var(--_selaras-color-fill)] hover:ring-[var(--_selaras-color-fill)] focus:ring-[var(--_selaras-color-fill)]' },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

export type PinInputThemeSlots = keyof (typeof pinInputTheme)['slots']
