import { tv } from 'tailwind-variants'

export const pageHeaderTheme = tv({
  slots: {
    root: 'flex flex-col gap-2 border-b border-[var(--selaras-resolved-border-default)] pb-6',
    title: 'text-3xl font-semibold tracking-tight text-[var(--selaras-resolved-text-default)]',
    description: 'text-base text-[var(--selaras-resolved-text-muted)]',
  },
})

export type PageHeaderThemeSlots = keyof (typeof pageHeaderTheme)['slots']
