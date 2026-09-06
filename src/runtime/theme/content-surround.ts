import { tv } from 'tailwind-variants'

export const contentSurroundTheme = tv({
  slots: {
    root: 'grid grid-cols-2 gap-4 border-t border-[var(--ui-border)] pt-6',
    link: 'group flex flex-col gap-1 rounded-[var(--ui-radius-md)] border border-[var(--ui-border)] p-4 transition-colors hover:border-[var(--ui-border-hover)]',
    label: 'flex items-center gap-1 text-xs font-medium text-[var(--ui-text-muted)]',
    icon: 'size-3.5 shrink-0',
    title: 'text-sm font-medium text-[var(--ui-text)] transition-colors group-hover:text-[var(--ui-primary)]',
  },
  variants: {
    // `next` right-aligns its own text and flips the label's icon+text
    // order (icon trailing, not leading) - `prev`/`next` read as mirror
    // images of each other, not two copies of the same layout.
    align: {
      start: { link: 'items-start text-start', label: 'flex-row' },
      end: { link: 'col-start-2 items-end text-end', label: 'flex-row-reverse' },
    },
  },
  defaultVariants: {
    align: 'start',
  },
})

export type ContentSurroundThemeSlots = keyof (typeof contentSurroundTheme)['slots']
