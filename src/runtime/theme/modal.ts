import { tv } from 'tailwind-variants'

export const modalTheme = tv({
  slots: {
    overlay: 'fixed inset-0 z-[var(--ui-z-modal-overlay)] bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
    // flex flex-col + the header/footer's own shrink-0 (native to a flex
    // child, no extra class needed) let a tall body scroll internally via
    // its own overflow-y-auto below, capped to the viewport height so a
    // centered dialog can never overflow past the screen edges regardless
    // of content length.
    content: 'fixed left-1/2 top-1/2 z-[var(--ui-z-modal)] flex max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col rounded-[var(--ui-radius-lg)] bg-[var(--ui-bg)] shadow-[var(--ui-shadow-lg)] focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    header: 'flex items-start justify-between gap-4 p-4 sm:px-6',
    title: 'text-base font-semibold text-[var(--ui-text)]',
    description: 'mt-1 text-sm text-[var(--ui-text-muted)]',
    // Rendered as an <SButton> (ghost/neutral) - real chrome, focus ring and
    // touch target now come from Button's own theme; rounded-full overrides
    // its default rounded-md just for this dismiss-glyph family (close/clear).
    close: 'shrink-0 rounded-full',
    body: 'overflow-y-auto p-4 sm:px-6',
    footer: 'flex items-center justify-end gap-2 p-4 sm:px-6',
  },
  variants: {
    fullscreen: {
      true: { content: 'inset-0 h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 rounded-none' },
    },
  },
})

export type ModalSlots = keyof (typeof modalTheme)['slots']
