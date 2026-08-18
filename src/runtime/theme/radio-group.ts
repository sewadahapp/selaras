import { tv } from 'tailwind-variants'

export const radioGroupTheme = tv({
  slots: {
    root: 'flex flex-col gap-2',
    itemWrapper: 'inline-flex items-center gap-2 cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50',
    item: 'flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[var(--ui-bg)] ring-1 ring-inset ring-[var(--ui-border)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)] data-[state=checked]:ring-[var(--ui-primary)]',
    indicator: 'size-2 rounded-full bg-[var(--ui-primary)]',
    label: 'select-none text-sm text-[var(--ui-text)]',
  },
  variants: {
    invalid: {
      true: { item: 'outline outline-2 outline-offset-1 outline-[var(--ui-danger)]' },
    },
  },
})

export type RadioGroupSlots = keyof (typeof radioGroupTheme)['slots']
