import { tv } from 'tailwind-variants'

export const drawerTheme = tv({
  slots: {
    overlay: 'fixed inset-0 z-[var(--ui-z-modal-overlay)] bg-black/50',
    content: 'fixed z-[var(--ui-z-modal)] flex flex-col bg-[var(--ui-bg)] shadow-[var(--ui-shadow-lg)] focus:outline-none',
    // A small rounded grip bar - purely visual, signals "draggable" the
    // same way a real bottom sheet's handle does. Centered via the
    // header's own flex row would fight the header's title/close layout,
    // so it gets its own row above everything else instead.
    handle: 'mx-auto my-2 h-1.5 w-12 shrink-0 rounded-full bg-[var(--ui-border)]',
    header: 'flex items-start justify-between gap-4 p-4 sm:px-6',
    title: 'text-base font-semibold text-[var(--ui-text)]',
    description: 'mt-1 text-sm text-[var(--ui-text-muted)]',
    close: 'shrink-0 rounded-full',
    body: 'flex-1 overflow-y-auto p-4 sm:px-6',
    footer: 'flex items-center justify-end gap-2 p-4 sm:px-6',
  },
  variants: {
    // Same reasoning as slideover.ts's own comment: no explicit h-full/
    // w-full here for any side - inset-x-*/inset-y-* below supply both
    // edges and let the browser derive the size implicitly.
    //
    // Unlike Slideover, every side always gets a rounded corner on its
    // own inner edge (not conditional on a prop) - a drawer's own visual
    // identity, distinct from Slideover's flush-by-default/optional-
    // floating-inset treatment.
    side: {
      top: { content: 'rounded-b-[var(--ui-radius-lg)]' },
      bottom: { content: 'rounded-t-[var(--ui-radius-lg)]' },
      left: { content: 'max-w-md rounded-e-[var(--ui-radius-lg)]' },
      right: { content: 'max-w-md rounded-s-[var(--ui-radius-lg)]' },
    },
    // See slideover.ts for why this lives entirely in the variant (and
    // compoundVariants below), not the base slot strings - tailwind-merge
    // doesn't recognize animate-in/animate-none as a conflicting pair.
    transition: {
      true: { overlay: 'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0' },
      false: {},
    },
  },
  compoundVariants: [
    { side: 'top', class: { content: 'inset-x-0 top-0 max-h-full' } },
    { side: 'bottom', class: { content: 'inset-x-0 bottom-0 max-h-full' } },
    { side: 'left', class: { content: 'inset-y-0 left-0 w-full' } },
    { side: 'right', class: { content: 'inset-y-0 right-0 w-full' } },
    { side: 'top', transition: true, class: { content: 'data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-full' } },
    { side: 'bottom', transition: true, class: { content: 'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full' } },
    { side: 'left', transition: true, class: { content: 'data-[state=open]:animate-in data-[state=open]:slide-in-from-left-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left-full' } },
    { side: 'right', transition: true, class: { content: 'data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full' } },
  ],
  defaultVariants: {
    // Bottom sheets are the classic drawer use case - unlike Slideover's
    // own 'right' default.
    side: 'bottom',
    transition: true,
  },
})

export type DrawerThemeSlots = keyof (typeof drawerTheme)['slots']
