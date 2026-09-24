import { tv } from 'tailwind-variants'

export const calendarTheme = tv({
  slots: {
    root: 'inline-block',
    header: 'mb-2 flex items-center justify-between gap-2',
    heading: 'text-sm font-medium text-[var(--selaras-resolved-text-default)]',
    grids: 'flex flex-col gap-4 sm:flex-row',
    // A calendar's seven date columns must keep equal width even when a slot
    // renders a long meeting title in only one of them.
    grid: 'w-full table-fixed border-collapse',
    gridHead: '',
    headCell: 'w-[14.285714%] h-8 text-xs font-medium text-[var(--selaras-resolved-text-muted)]',
    cell: 'p-0.5 text-center align-top',
    dayButton: 'relative data-[today]:font-semibold data-[today]:after:absolute data-[today]:after:bottom-1 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 data-[today]:after:rounded-full data-[today]:after:bg-[var(--_selaras-color-fill)] data-[outside-view]:opacity-40 data-[unavailable]:opacity-40 data-[unavailable]:line-through',
    dayDetails: 'min-w-0',
    footer: 'mt-3',
  },
})

export type CalendarThemeSlots = keyof (typeof calendarTheme)['slots']
