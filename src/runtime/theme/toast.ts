import { tv } from 'tailwind-variants'

export const toastTheme = tv({
  slots: {
    viewport: 'fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4 outline-none',
    root: 'relative flex items-start gap-3 rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] p-4 pr-8 shadow-[var(--ui-shadow-lg)] ring-1 ring-[var(--ui-border)] data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-full',
    title: 'text-sm font-medium text-[var(--ui-text)]',
    description: 'mt-1 text-sm text-[var(--ui-text-muted)]',
    close: 'absolute right-2 top-2 shrink-0 rounded-[var(--ui-radius-sm)] p-1 text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)]',
  },
})

export type ToastSlots = keyof (typeof toastTheme)['slots']
