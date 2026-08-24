import { tv } from 'tailwind-variants'

export const iconTheme = tv({
  slots: {
    base: 'shrink-0',
  },
  variants: {
    size: {
      sm: { base: 'size-4' },
      md: { base: 'size-5' },
      lg: { base: 'size-6' },
    },
    // No default - an unset color inherits currentColor from wherever the
    // icon is placed, which is what every internal usage elsewhere in this
    // library already relies on (e.g. Input's --ui-text-muted icon slots).
    color: {
      primary: { base: 'text-[var(--ui-primary)]' },
      neutral: { base: 'text-[var(--ui-text)]' },
      secondary: { base: 'text-[var(--ui-secondary)]' },
      success: { base: 'text-[var(--ui-success)]' },
      danger: { base: 'text-[var(--ui-danger)]' },
      info: { base: 'text-[var(--ui-info)]' },
      warning: { base: 'text-[var(--ui-warning)]' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type IconSlots = keyof (typeof iconTheme)['slots']
