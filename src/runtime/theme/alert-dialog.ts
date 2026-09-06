import { tv } from 'tailwind-variants'

export const alertDialogTheme = tv({
  slots: {
    // Same layer as Modal's own overlay/content - an alert dialog is the
    // same kind of centered, blocking surface, just a distinct semantic
    // (Reka's AlertDialogContent unconditionally blocks outside-click
    // dismissal itself, so there's no need for a second z-index tier).
    overlay: 'fixed inset-0 z-[var(--ui-z-modal-overlay)] bg-black/50',
    content: 'fixed left-1/2 top-1/2 z-[var(--ui-z-modal)] flex max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-[var(--ui-radius-lg)] bg-[var(--ui-bg)] p-6 shadow-[var(--ui-shadow-lg)] focus:outline-none',
    header: 'flex flex-col gap-1',
    title: 'text-base font-semibold text-[var(--ui-text)]',
    description: 'text-sm text-[var(--ui-text-muted)]',
    body: 'text-sm text-[var(--ui-text-muted)]',
    footer: 'flex items-center justify-end gap-2',
  },
  variants: {
    // See Modal's own theme for why the animation classes live entirely
    // inside this variant rather than the base slot strings.
    transition: {
      true: {
        overlay: 'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        content: 'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      },
      false: {},
    },
  },
  defaultVariants: {
    transition: true,
  },
})

export type AlertDialogThemeSlots = keyof (typeof alertDialogTheme)['slots']
