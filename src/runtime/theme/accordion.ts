import { tv } from 'tailwind-variants'

export const accordionTheme = tv({
  slots: {
    root: 'flex flex-col',
    item: 'border-b border-[var(--ui-border)] last:border-b-0',
    header: '',
    trigger: 'group flex w-full items-center justify-between gap-2 py-3 text-start font-medium text-[var(--ui-text)] transition-colors hover:text-[var(--ui-primary)]',
    label: '',
    chevron: 'size-4 shrink-0 text-[var(--ui-text-muted)] transition-transform group-data-[state=open]:rotate-180',
    content: 'pb-3 text-sm text-[var(--ui-text-muted)]',
  },
})

export type AccordionSlots = keyof (typeof accordionTheme)['slots']
