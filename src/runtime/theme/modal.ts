import { tv } from 'tailwind-variants'

export const modalTheme = tv({
  slots: {
    overlay: 'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
    content: 'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--ui-radius-lg)] bg-[var(--ui-bg)] shadow-[var(--ui-shadow-lg)] focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    header: 'flex items-start justify-between gap-4 p-4 sm:px-6',
    title: 'text-base font-semibold text-[var(--ui-text)]',
    description: 'mt-1 text-sm text-[var(--ui-text-muted)]',
    close: 'shrink-0 rounded-[var(--ui-radius-sm)] p-1 text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)]',
    body: 'p-4 sm:px-6',
    footer: 'flex items-center justify-end gap-2 p-4 sm:px-6',
  },
})

export type ModalSlots = keyof (typeof modalTheme)['slots']
