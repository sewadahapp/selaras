import { tv } from 'tailwind-variants'

export const pageHeaderTheme = tv({
  slots: {
    root: 'flex flex-col gap-2 border-b border-[var(--ui-border)] pb-6',
    title: 'text-3xl font-semibold tracking-tight text-[var(--ui-text)]',
    description: 'text-base text-[var(--ui-text-muted)]',
  },
})

export type PageHeaderSlots = keyof (typeof pageHeaderTheme)['slots']
