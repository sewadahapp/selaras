import { tv } from 'tailwind-variants'

export const slideoverTheme = tv({
  slots: {
    overlay: 'fixed inset-0 z-[var(--ui-z-modal-overlay)] bg-black/50',
    content: 'fixed z-[var(--ui-z-modal)] flex flex-col bg-[var(--ui-bg)] shadow-[var(--ui-shadow-lg)] focus:outline-none',
    header: 'flex items-start justify-between gap-4 p-4 sm:px-6',
    title: 'text-base font-semibold text-[var(--ui-text)]',
    description: 'mt-1 text-sm text-[var(--ui-text-muted)]',
    close: 'shrink-0 rounded-full',
    body: 'flex-1 overflow-y-auto p-4 sm:px-6',
    footer: 'flex items-center justify-end gap-2 p-4 sm:px-6',
  },
  variants: {
    // Deliberately no height/width here for any side - inset-x-*/inset-y-*
    // below (varying by `inset`) supply both edges and let the browser
    // derive the size implicitly. Setting an explicit h-full/w-full here
    // too would over-constrain the box: for a fixed element with top,
    // bottom, AND height all specified, height wins and the browser
    // recomputes bottom from it - silently discarding inset-y-4's margin
    // and letting the panel overflow past the viewport edge. Found via a
    // real browser check on the inset example (side=right defaulted):
    // the panel's own bottom sat 16px past the viewport bottom, exactly
    // matching inset-y-4's 16px top offset carried straight through to
    // an unconstrained h-full height.
    side: {
      top: { content: '' },
      bottom: { content: '' },
      left: { content: 'max-w-md' },
      right: { content: 'max-w-md' },
    },
    inset: {
      true: { content: 'rounded-[var(--ui-radius-lg)] ring-1 ring-[var(--ui-border)]' },
    },
    // The animation classes live entirely in this variant (and the
    // compoundVariants below) rather than the base slot strings above -
    // see modal.ts for why: tailwind-merge doesn't recognize
    // animate-in/animate-none as a conflicting pair, so keeping both
    // states' full class sets inside the variant avoids that entirely.
    transition: {
      true: { overlay: 'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0' },
      false: {},
    },
  },
  compoundVariants: [
    { side: 'top', inset: true, class: { content: 'inset-x-4 top-4 max-h-[calc(100%-2rem)]' } },
    { side: 'top', inset: false, class: { content: 'inset-x-0 top-0 max-h-full' } },
    { side: 'bottom', inset: true, class: { content: 'inset-x-4 bottom-4 max-h-[calc(100%-2rem)]' } },
    { side: 'bottom', inset: false, class: { content: 'inset-x-0 bottom-0 max-h-full' } },
    { side: 'left', inset: true, class: { content: 'inset-y-4 left-4 w-[calc(100%-2rem)]' } },
    { side: 'left', inset: false, class: { content: 'inset-y-0 left-0 w-full' } },
    { side: 'right', inset: true, class: { content: 'inset-y-4 right-4 w-[calc(100%-2rem)]' } },
    { side: 'right', inset: false, class: { content: 'inset-y-0 right-0 w-full' } },
    { side: 'top', transition: true, class: { content: 'data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-full' } },
    { side: 'bottom', transition: true, class: { content: 'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full' } },
    { side: 'left', transition: true, class: { content: 'data-[state=open]:animate-in data-[state=open]:slide-in-from-left-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left-full' } },
    { side: 'right', transition: true, class: { content: 'data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full' } },
  ],
  defaultVariants: {
    side: 'right',
    transition: true,
  },
})

export type SlideoverThemeSlots = keyof (typeof slideoverTheme)['slots']
