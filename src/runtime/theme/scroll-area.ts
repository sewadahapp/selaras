import { tv } from 'tailwind-variants'

export const scrollAreaTheme = tv({
  slots: {
    root: 'relative overflow-hidden',
    viewport: 'h-full w-full rounded-[inherit]',
    scrollbar: 'flex touch-none select-none p-0.5 transition-colors data-[orientation=vertical]:w-2 data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:flex-col',
    thumb: 'relative flex-1 rounded-full bg-[var(--ui-border)] before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2',
    corner: 'bg-[var(--ui-bg-elevated)]',
  },
})

export type ScrollAreaSlots = keyof (typeof scrollAreaTheme)['slots']
