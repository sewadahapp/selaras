import { tv } from 'tailwind-variants'

export const tableTheme = tv({
  slots: {
    root: 'w-full',
    wrapper: 'overflow-x-auto rounded-[var(--ui-radius-md)] ring-1 ring-[var(--ui-border)]',
    table: 'w-full border-collapse text-sm',
    thead: 'bg-[var(--ui-bg-elevated)]',
    tr: 'border-b border-[var(--ui-border)] last:border-b-0',
    th: 'px-3 py-2 text-left font-medium text-[var(--ui-text-muted)] whitespace-nowrap',
    thSortable: 'cursor-pointer select-none hover:text-[var(--ui-text)]',
    sortIcon: 'ml-1 inline-block size-3.5 align-text-bottom text-[var(--ui-text-muted)]',
    td: 'px-3 py-2 text-[var(--ui-text)]',
    tfoot: 'bg-[var(--ui-bg-elevated)] font-medium',
    emptyState: 'px-3 py-8 text-center text-sm text-[var(--ui-text-muted)]',
    filterInput: 'mt-1',
    paginationWrapper: 'flex items-center justify-between gap-3 px-3 py-2',
    paginationInfo: 'text-sm text-[var(--ui-text-muted)]',
    paginationButtons: 'flex items-center gap-2',
  },
})

export type TableSlots = keyof (typeof tableTheme)['slots']
