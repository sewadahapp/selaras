import { tv } from 'tailwind-variants'

export const contentTocTheme = tv({
  slots: {
    root: 'flex flex-col gap-2 text-sm',
    title: 'font-medium text-[var(--ui-text)]',
    list: 'flex flex-col gap-1',
    item: 'flex flex-col',
    link: 'block border-l-2 border-transparent py-0.5 pl-3 text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-text)]',
    content: 'ml-3 flex flex-col gap-1',
  },
  variants: {
    active: {
      true: { link: 'border-[var(--ui-primary)] text-[var(--ui-primary)]' },
    },
  },
})

export type ContentTocSlots = keyof (typeof contentTocTheme)['slots']
