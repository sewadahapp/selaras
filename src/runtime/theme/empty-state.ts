import { tv } from 'tailwind-variants'

export const emptyStateTheme = tv({
  slots: {
    root: 'flex w-full flex-col items-center justify-center gap-4 px-6 py-12 text-center',
    icon: 'flex size-10 shrink-0 items-center justify-center text-[var(--selaras-resolved-text-muted)]',
    content: 'min-w-0 max-w-md space-y-2',
    title: 'text-base font-semibold text-[var(--selaras-resolved-text-default)]',
    description: 'text-sm leading-relaxed text-pretty text-[var(--selaras-resolved-text-muted)]',
    actions: 'flex flex-wrap items-center justify-center gap-2',
  },
})

export type EmptyStateThemeSlots = keyof (typeof emptyStateTheme)['slots']
