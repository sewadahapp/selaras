import { tv } from 'tailwind-variants'

export const contentNavigationTheme = tv({
  slots: {
    root: 'flex flex-col gap-0.5 text-sm',
    item: 'flex flex-col',
    link: 'block rounded-[var(--ui-radius-sm)] px-2 py-1.5 text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-bg-elevated)] hover:text-[var(--ui-text)]',
    linkActive: 'block rounded-[var(--ui-radius-sm)] bg-[var(--ui-primary-soft)] px-2 py-1.5 text-[var(--ui-primary)]',
    trigger: 'group flex w-full items-center justify-between gap-2 rounded-[var(--ui-radius-sm)] px-2 py-1.5 text-left font-medium text-[var(--ui-text)] transition-colors hover:bg-[var(--ui-bg-elevated)]',
    chevron: 'size-4 shrink-0 text-[var(--ui-text-muted)] transition-transform group-data-[state=open]:rotate-180',
    content: 'ml-3 flex flex-col gap-0.5 border-l border-[var(--ui-border)] pl-2',
  },
})

export type ContentNavigationSlots = keyof (typeof contentNavigationTheme)['slots']
