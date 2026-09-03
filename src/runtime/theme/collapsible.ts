import { tv } from 'tailwind-variants'

export const collapsibleTheme = tv({
  slots: {
    root: 'w-full',
    trigger: 'group flex w-full items-center justify-between gap-2 text-start font-medium text-[var(--ui-text)] transition-colors hover:text-[var(--ui-primary)] disabled:opacity-50 disabled:pointer-events-none',
    chevron: 'size-4 shrink-0 text-[var(--ui-text-muted)] transition-transform group-data-[state=open]:rotate-180',
    // overflow-hidden clips the panel to its own animated height (without
    // it, content would visibly spill out mid-animation); the two
    // data-state keyframes interpolate between 0 and Reka's own measured
    // --reka-collapsible-content-height, so this never hardcodes a height.
    content: 'overflow-hidden text-[var(--ui-text-muted)] data-[state=open]:animate-[selaras-collapsible-down_200ms_ease-out] data-[state=closed]:animate-[selaras-collapsible-up_200ms_ease-out]',
    // A separate slot (not `content` itself) for the padding - the padding
    // must NOT be part of the height being animated (animating a 0-to-N
    // height with vertical padding baked in either clips the last few
    // pixels of padding at 0, or overshoots the real content height), so
    // it moves one level in.
    contentInner: 'pt-2',
  },
  variants: {
    size: {
      sm: { trigger: 'text-sm', content: 'text-sm' },
      md: { trigger: 'text-sm', content: 'text-sm' },
      lg: { trigger: 'text-base', content: 'text-base' },
    },
    // Reka always renders the trigger before the content in the DOM -
    // that never changes. `flex-col-reverse` only flips the *visual*
    // order, so `up` still reveals below the same trigger element in
    // the accessibility tree/tab order, it just displays above it.
    direction: {
      down: { root: 'flex flex-col' },
      up: {
        root: 'flex flex-col-reverse',
        // Base chevron points down at rest, rotates to point up once
        // open - backwards for `up`, where content reveals upward.
        // Flipped here so it still points toward where the content
        // will appear: up at rest, back down once open.
        chevron: 'rotate-180 group-data-[state=open]:rotate-0',
        contentInner: 'pt-0 pb-2',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    direction: 'down',
  },
})

export type CollapsibleThemeSlots = keyof (typeof collapsibleTheme)['slots']
