import { tv } from 'tailwind-variants'

export const formFieldTheme = tv({
  slots: {
    root: 'flex flex-col gap-1.5',
    // Groups label+description as one unit next to `container` in
    // horizontal orientation - plain flex-col stacking (matching root's
    // own default look exactly) in vertical.
    body: 'flex flex-col gap-1.5',
    header: '',
    label: 'text-sm font-medium text-[var(--ui-text)]',
    required: 'ms-0.5 text-[var(--ui-danger)]',
    description: 'text-xs text-[var(--ui-text-muted)]',
    container: '',
    hint: 'text-xs text-[var(--ui-text-muted)]',
    error: 'text-xs text-[var(--ui-danger)]',
  },
  variants: {
    // Scales FormField's own label/description/hint/error text to match
    // the size passed to the wrapped control (that part already flows
    // through FormFieldContext - this is just making FormField's own
    // text visually agree with it too).
    size: {
      sm: { label: 'text-xs' },
      md: {}, // matches the base slot classes above exactly
      lg: { label: 'text-base', description: 'text-sm', hint: 'text-sm', error: 'text-sm' },
    },
    orientation: {
      vertical: {},
      horizontal: { body: 'flex-row items-start gap-3', header: 'shrink-0', container: 'flex-1 min-w-0' },
    },
  },
  defaultVariants: {
    size: 'md',
    orientation: 'vertical',
  },
})

export type FormFieldSlots = keyof (typeof formFieldTheme)['slots']
