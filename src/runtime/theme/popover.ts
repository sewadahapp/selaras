import { tv } from 'tailwind-variants'

export const popoverTheme = tv({
  slots: {
    content: 'z-[var(--ui-z-dropdown)] rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] p-4 shadow-[var(--ui-shadow-md)] ring-1 ring-[var(--ui-border)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
    arrow: 'fill-[var(--ui-bg)]',
  },
})

export type PopoverSlots = keyof (typeof popoverTheme)['slots']
