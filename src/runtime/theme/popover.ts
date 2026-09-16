import { tv } from 'tailwind-variants'

export const popoverTheme = tv({
  slots: {
    content: 'z-[var(--selaras-resolved-z-dropdown)] rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-default)] p-4 shadow-[var(--selaras-resolved-shadow-md)] ring-1 ring-[var(--selaras-resolved-border-default)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
    arrow: 'fill-[var(--selaras-resolved-surface-default)] stroke-[var(--selaras-resolved-border-default)] stroke-1',
  },
})

export type PopoverThemeSlots = keyof (typeof popoverTheme)['slots']
