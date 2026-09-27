import { tv } from 'tailwind-variants'

export const timelineTheme = tv({
  slots: {
    root: 'relative flex w-full min-w-0 text-[var(--selaras-resolved-text-default)]',
    item: 'relative min-w-0',
    track: 'relative',
    marker: 'relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 border-[var(--_selaras-color-fill)] bg-[var(--selaras-resolved-surface-default)] text-[var(--_selaras-color-text)] data-[marker-type=dot]:size-3 data-[marker-type=dot]:border-0 data-[marker-type=dot]:bg-[var(--_selaras-color-fill)] data-[marker-type=custom]:border-0 data-[marker-type=custom]:bg-transparent',
    icon: 'size-4 shrink-0',
    connector: 'pointer-events-none bg-[var(--selaras-resolved-border-default)]',
    content: 'min-w-0',
    date: 'mb-1 text-xs text-[var(--selaras-resolved-text-muted)]',
    title: 'font-medium',
    description: 'mt-1 text-sm text-[var(--selaras-resolved-text-muted)]',
  },
  variants: {
    orientation: {
      vertical: {
        root: 'flex-col',
        item: 'grid grid-cols-[1rem_minmax(0,1fr)] gap-x-4 py-4 first:pt-0 last:pb-0',
        track: 'col-start-1 row-start-1 row-span-2 flex flex-col items-center',
        connector: 'absolute start-1/2 top-4 -bottom-8 w-px -translate-x-1/2 rtl:translate-x-1/2',
        content: 'row-start-1',
      },
      horizontal: {
        root: 'flex-row items-stretch',
        item: 'grid flex-1 grid-rows-[minmax(0,1fr)_2rem_minmax(0,1fr)]',
        track: 'relative row-start-2 h-8 w-full',
        marker: 'absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2',
        connector: 'absolute start-1/2 top-1/2 h-px w-full -translate-y-1/2',
        content: 'min-w-0 px-3 text-center',
      },
    },
    align: {
      start: {
        item: '',
        track: '',
        content: '',
      },
      end: {
        item: '',
        track: '',
        content: '',
      },
      alternate: {
        item: '',
        track: '',
        content: '',
      },
    },
    size: {
      sm: { marker: 'size-6 text-xs data-[marker-type=dot]:size-3', title: 'text-sm' },
      md: { marker: 'size-8 text-sm data-[marker-type=dot]:size-4', title: 'text-base' },
      lg: { marker: 'size-10 text-base data-[marker-type=dot]:size-5', title: 'text-lg' },
    },
    color: {
      primary: { marker: 'border-[var(--_selaras-color-fill)] text-[var(--_selaras-color-text)]' },
      neutral: { marker: 'border-[var(--_selaras-color-fill)] text-[var(--_selaras-color-text)]' },
      secondary: { marker: 'border-[var(--_selaras-color-fill)] text-[var(--_selaras-color-text)]' },
      success: { marker: 'border-[var(--_selaras-color-fill)] text-[var(--_selaras-color-text)]' },
      danger: { marker: 'border-[var(--_selaras-color-fill)] text-[var(--_selaras-color-text)]' },
      info: { marker: 'border-[var(--_selaras-color-fill)] text-[var(--_selaras-color-text)]' },
      warning: { marker: 'border-[var(--_selaras-color-fill)] text-[var(--_selaras-color-text)]' },
    },
  },
  compoundVariants: [
    { orientation: 'vertical', align: 'end', class: {
      item: 'grid-cols-[minmax(0,1fr)_1rem]',
      track: 'col-start-2',
      content: 'col-start-1 text-end',
    } },
    { orientation: 'vertical', align: 'alternate', class: {
      item: 'grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)]',
      track: 'col-start-2',
    } },
    { orientation: 'horizontal', align: 'start', class: { content: 'row-start-3' } },
    { orientation: 'horizontal', align: 'end', class: { content: 'row-start-1' } },
  ],
  defaultVariants: {
    orientation: 'vertical',
    align: 'start',
    size: 'md',
    color: 'primary',
  },
})

export type TimelineThemeSlots = keyof (typeof timelineTheme)['slots']
