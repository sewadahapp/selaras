import { tv } from 'tailwind-variants'

export const tableTheme = tv({
  slots: {
    root: 'relative w-full',
    wrapper: 'overflow-x-auto rounded-[var(--ui-radius-md)] ring-1 ring-[var(--ui-border)]',
    table: 'w-full border-collapse',
    thead: 'bg-[var(--ui-bg-elevated)]',
    tr: 'border-b border-[var(--ui-border)] last:border-b-0',
    th: 'text-left font-medium text-[var(--ui-text-muted)] whitespace-nowrap data-[pinned]:sticky data-[pinned]:z-[1] data-[pinned]:bg-[var(--ui-bg-elevated)]',
    thSortable: 'cursor-pointer select-none hover:text-[var(--ui-text)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ui-primary)]',
    sortIcon: 'ml-1 inline-block size-3.5 align-text-bottom text-[var(--ui-text-muted)]',
    td: 'text-[var(--ui-text)] data-[pinned]:sticky data-[pinned]:z-[1] data-[pinned]:bg-[var(--ui-bg)]',
    tfoot: 'bg-[var(--ui-bg-elevated)] font-medium',
    emptyState: 'px-3 py-8 text-center text-sm text-[var(--ui-text-muted)]',
    filterInput: 'mt-1',
    paginationWrapper: 'flex items-center justify-between gap-3 px-3 py-2',
    paginationInfo: 'text-sm text-[var(--ui-text-muted)]',
    paginationButtons: 'flex items-center gap-2',
    loadingOverlay: 'absolute inset-0 z-10 flex items-center justify-center bg-[var(--ui-bg)]/60',
    loadingIcon: 'size-6 animate-spin text-[var(--ui-primary)]',
    expandButton: 'flex size-5 shrink-0 items-center justify-center text-[var(--ui-text-muted)]',
    expandChevron: 'size-4 transition-transform data-[expanded]:rotate-90',
    expandedRow: 'border-b border-[var(--ui-border)] last:border-b-0',
    expandedCell: 'bg-[var(--ui-bg-elevated)] px-3 py-3 text-[var(--ui-text)]',
    columnToggle: 'relative',
    columnTogglePanel: 'absolute right-0 z-20 mt-1 flex min-w-40 flex-col gap-1 rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] p-2 shadow-[var(--ui-shadow-md)] ring-1 ring-[var(--ui-border)]',
    columnToggleItem: 'flex items-center gap-2 rounded-[var(--ui-radius-sm)] px-2 py-1.5 text-sm text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)]',
  },
  variants: {
    size: {
      sm: { th: 'px-2 py-1.5 text-xs', td: 'px-2 py-1.5 text-xs' },
      md: { th: 'px-3 py-2 text-sm', td: 'px-3 py-2 text-sm' },
      lg: { th: 'px-4 py-3 text-base', td: 'px-4 py-3 text-base' },
    },
    gridlines: {
      true: {
        table: 'border border-[var(--ui-border)]',
        th: 'border border-[var(--ui-border)]',
        td: 'border border-[var(--ui-border)]',
      },
    },
    striped: {
      true: { table: '[&>tbody>tr:nth-child(even)]:bg-[var(--ui-bg-elevated)]' },
    },
    scrollable: {
      true: { wrapper: 'overflow-y-auto', thead: 'sticky top-0 z-[1]' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type TableSlots = keyof (typeof tableTheme)['slots']
