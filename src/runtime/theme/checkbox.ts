import { tv } from 'tailwind-variants'

export const checkboxTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-2 cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50',
    box: 'flex size-4.5 shrink-0 items-center justify-center rounded-[var(--ui-radius-sm)] bg-[var(--ui-bg)] ring-1 ring-inset ring-[var(--ui-border)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)] data-[state=checked]:bg-[var(--ui-primary)] data-[state=checked]:ring-[var(--ui-primary)] data-[state=indeterminate]:bg-[var(--ui-primary)] data-[state=indeterminate]:ring-[var(--ui-primary)]',
    indicator: 'flex items-center justify-center text-[var(--ui-primary-foreground)]',
    label: 'select-none text-sm text-[var(--ui-text)]',
  },
  variants: {
    invalid: {
      true: { box: 'outline outline-2 outline-offset-1 outline-[var(--ui-danger)]' },
    },
  },
})

export type CheckboxSlots = keyof (typeof checkboxTheme)['slots']
