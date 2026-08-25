import { tv } from 'tailwind-variants'

export const toastTheme = tv({
  slots: {
    viewport: 'fixed bottom-0 right-0 z-[var(--ui-z-toast)] flex w-full max-w-sm flex-col gap-2 p-4 outline-none',
    root: 'relative flex items-start gap-3 rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] p-4 pr-10 shadow-[var(--ui-shadow-lg)] ring-1 ring-[var(--ui-border)] data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-full',
    title: 'text-sm font-medium text-[var(--ui-text)]',
    description: 'mt-1 text-sm text-[var(--ui-text-muted)]',
    // Rendered as an <SButton> (ghost/neutral) - real chrome, focus ring and
    // touch target now come from Button's own theme; rounded-full overrides
    // its default rounded-md just for this dismiss-glyph family (close/clear).
    // Positioning (this card doesn't lay it out via flex, unlike Modal's
    // header) stays here, alongside the root's matching pr- reserved space.
    close: 'absolute right-1.5 top-1.5 shrink-0 rounded-full',
  },
})

export type ToastSlots = keyof (typeof toastTheme)['slots']
