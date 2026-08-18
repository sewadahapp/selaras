import { tv } from 'tailwind-variants'

export const switchTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-2 cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50',
    track: 'relative inline-flex h-6 w-10 shrink-0 items-center rounded-[var(--ui-radius-full)] bg-[var(--ui-border)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-primary)] data-[state=checked]:bg-[var(--ui-primary)]',
    thumb: 'block size-5 translate-x-0.5 rounded-full bg-white shadow-[var(--ui-shadow-sm)] transition-transform data-[state=checked]:translate-x-[18px]',
    label: 'select-none text-sm text-[var(--ui-text)]',
  },
  variants: {
    invalid: {
      true: { track: 'outline outline-2 outline-offset-1 outline-[var(--ui-danger)]' },
    },
  },
})

export type SwitchSlots = keyof (typeof switchTheme)['slots']
