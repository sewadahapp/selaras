import { tv } from 'tailwind-variants'

export const accordionTheme = tv({
  slots: {
    // w-full - without an explicit width, the root shrinks to fit
    // whichever child happens to be widest at that moment (a closed
    // item's own title vs an open item's own content), so the whole
    // accordion visibly resized itself as items opened/closed.
    root: 'w-full flex flex-col',
    item: 'border-b border-[var(--ui-border)] last:border-b-0',
    header: '',
    trigger: 'group flex w-full items-center justify-between gap-2 text-start font-medium text-[var(--ui-text)] transition-colors hover:text-[var(--ui-primary)] disabled:opacity-50 disabled:pointer-events-none',
    label: '',
    chevron: 'size-4 shrink-0 text-[var(--ui-text-muted)] transition-transform group-data-[state=open]:rotate-180',
    // overflow-hidden clips the panel to its own animated height (without
    // it, content would visibly spill out mid-animation); the two
    // data-state keyframes interpolate between 0 and Reka's own measured
    // --reka-accordion-content-height, so this never hardcodes a height.
    content: 'overflow-hidden text-[var(--ui-text-muted)] data-[state=open]:animate-[selaras-accordion-down_200ms_ease-out] data-[state=closed]:animate-[selaras-accordion-up_200ms_ease-out]',
    // A separate slot (not `content` itself) for the padding that used to
    // live on `content` directly - the padding must NOT be part of the
    // height being animated (animating a 0-to-N height with vertical
    // padding baked in either clips the last few pixels of padding at 0,
    // or overshoots the real content height), so it moves one level in.
    contentInner: 'pb-3',
  },
  variants: {
    size: {
      sm: { trigger: 'py-2 text-sm', content: 'text-sm' },
      md: { trigger: 'py-3 text-sm', content: 'text-sm' },
      lg: { trigger: 'py-4 text-base', content: 'text-base' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type AccordionSlots = keyof (typeof accordionTheme)['slots']
