import { tv } from 'tailwind-variants'

export const tabsTheme = tv({
  slots: {
    root: 'w-full',
    list: 'flex items-center gap-4 border-b border-[var(--ui-border)]',
    trigger: 'relative -mb-px px-1 py-2 text-sm font-medium text-[var(--ui-text-muted)] border-b-2 border-transparent transition-colors hover:text-[var(--ui-text)] disabled:opacity-50 disabled:pointer-events-none data-[state=active]:text-[var(--ui-primary)] data-[state=active]:border-[var(--ui-primary)]',
    content: 'pt-4 focus-visible:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-0',
  },
})

export type TabsSlots = keyof (typeof tabsTheme)['slots']
