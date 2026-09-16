import { tv } from 'tailwind-variants'

export const tableTheme = tv({
  slots: {
    root: 'relative w-full',
    wrapper: 'overflow-x-auto rounded-[var(--selaras-resolved-radius-md)] ring-1 ring-[var(--selaras-resolved-border-default)]',
    table: 'w-full border-collapse',
    thead: 'bg-[var(--selaras-resolved-surface-elevated)]',
    tr: 'border-b border-[var(--selaras-resolved-border-default)] last:border-b-0',
    th: 'text-start font-medium text-[var(--selaras-resolved-text-muted)] whitespace-nowrap data-[pinned]:sticky data-[pinned]:z-[1] data-[pinned]:bg-[var(--selaras-resolved-surface-elevated)]',
    thSortable: 'cursor-pointer select-none hover:text-[var(--selaras-resolved-text-default)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--_selaras-color-focus)]',
    sortIcon: 'ms-1 inline-block size-3.5 align-text-bottom text-[var(--selaras-resolved-text-muted)]',
    td: 'text-[var(--selaras-resolved-text-default)] data-[pinned]:sticky data-[pinned]:z-[1] data-[pinned]:bg-[var(--selaras-resolved-surface-default)]',
    tfoot: 'bg-[var(--selaras-resolved-surface-elevated)] font-medium',
    emptyState: 'px-3 py-8 text-center text-sm text-[var(--selaras-resolved-text-muted)]',
    filterInput: 'mt-1',
    paginationWrapper: 'flex items-center justify-between gap-3 px-3 py-2',
    paginationInfo: 'text-sm text-[var(--selaras-resolved-text-muted)]',
    paginationButtons: 'flex items-center gap-2',
    loadingOverlay: 'absolute inset-0 z-10 flex items-center justify-center bg-[var(--selaras-resolved-surface-default)]/60',
    loadingIcon: 'size-6 animate-spin text-[var(--_selaras-color-text)]',
    expandButton: 'flex size-5 shrink-0 items-center justify-center text-[var(--selaras-resolved-text-muted)]',
    // Points toward the reading-start direction while collapsed - 0deg
    // (right) under LTR, 180deg (left) under RTL - then always rotates to
    // an absolute 90deg once expanded, which already points down under
    // either direction, so that state needs no separate RTL variant of
    // its own. The rtl:data-[expanded] compound pins that absolute value
    // for the one case where both conditions hold at once, rather than
    // leaving the outcome to rely on Tailwind's variant cascade order.
    expandChevron: 'size-4 transition-transform rtl:rotate-180 data-[expanded]:rotate-90 rtl:data-[expanded]:rotate-90',
    expandedRow: 'border-b border-[var(--selaras-resolved-border-default)] last:border-b-0',
    expandedCell: 'bg-[var(--selaras-resolved-surface-elevated)] px-3 py-3 text-[var(--selaras-resolved-text-default)]',
    columnToggle: 'relative',
    columnTogglePanel: 'absolute end-0 z-20 mt-1 flex min-w-40 flex-col gap-1 rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-default)] p-2 shadow-[var(--selaras-resolved-shadow-md)] ring-1 ring-[var(--selaras-resolved-border-default)]',
    columnToggleItem: 'flex items-center gap-2 rounded-[var(--selaras-resolved-radius-sm)] px-2 py-1.5 text-sm text-[var(--selaras-resolved-text-default)] hover:bg-[var(--selaras-resolved-surface-elevated)]',
  },
  variants: {
    color: {
      primary: '',
      neutral: '',
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    size: {
      sm: { th: 'px-2 py-1.5 text-xs', td: 'px-2 py-1.5 text-xs' },
      md: { th: 'px-3 py-2 text-sm', td: 'px-3 py-2 text-sm' },
      lg: { th: 'px-4 py-3 text-base', td: 'px-4 py-3 text-base' },
    },
    gridlines: {
      true: {
        table: 'border border-[var(--selaras-resolved-border-default)]',
        th: 'border border-[var(--selaras-resolved-border-default)]',
        td: 'border border-[var(--selaras-resolved-border-default)]',
      },
    },
    striped: {
      true: { table: '[&>tbody>tr:nth-child(even)]:bg-[var(--selaras-resolved-surface-elevated)]' },
    },
    scrollable: {
      true: { wrapper: 'overflow-y-auto', thead: 'sticky top-0 z-[1]' },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

export type TableThemeSlots = keyof (typeof tableTheme)['slots']
